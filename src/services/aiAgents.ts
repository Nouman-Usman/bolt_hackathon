import openai from '../lib/openai';
import { getCurriculum, getChapterById } from '../data/curriculum';
import { getPastPapers, getQuestionsByType } from '../data/pastPapers';
import { Subject, Board, Grade } from '../types/user';

export interface QuizGenerationRequest {
  subject: Subject;
  board: Board;
  grade: Grade;
  chapterIds: string[];
  questionCount: number;
  questionTypes: ('MCQ' | 'Short Answer' | 'Long Answer' | 'Numerical')[];
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  language: 'english' | 'urdu';
  includeFormulas?: boolean;
  focusAreas?: string[];
}

export interface GeneratedQuestion {
  id: string;
  type: 'MCQ' | 'Short Answer' | 'Long Answer' | 'Numerical';
  questionText: string;
  questionTextUrdu?: string;
  options?: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctAnswer?: string;
  solution: string;
  solutionUrdu?: string;
  marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  chapterId: string;
  topic: string;
  learningObjective: string;
}

export interface QuizResponse {
  questions: GeneratedQuestion[];
  totalMarks: number;
  estimatedTime: number;
  metadata: {
    subject: Subject;
    board: Board;
    grade: Grade;
    chapters: string[];
    generatedAt: Date;
  };
}

class AIQuizAgent {
  private async buildContextPrompt(request: QuizGenerationRequest): Promise<string> {
    const curriculum = getCurriculum(request.subject, request.board, request.grade);
    if (!curriculum) {
      throw new Error(`Curriculum not found for ${request.subject} ${request.grade} ${request.board}`);
    }

    // Get relevant chapters
    const chapters = request.chapterIds.map(id => getChapterById(id)).filter(Boolean);
    
    // Get past papers for reference
    const pastPapers = getPastPapers(request.subject, request.board, request.grade, request.chapterIds);
    
    // Build comprehensive context
    let context = `You are an expert ${request.subject} teacher for ${request.grade} grade ${request.board} Board in Pakistan.\n\n`;
    
    context += `CURRICULUM CONTEXT:\n`;
    context += `Subject: ${request.subject}\n`;
    context += `Board: ${request.board}\n`;
    context += `Grade: ${request.grade}\n\n`;

    context += `EXAM PATTERN:\n`;
    context += `Total Marks: ${curriculum.examPattern.totalMarks}\n`;
    context += `Time Limit: ${curriculum.examPattern.timeLimit} minutes\n`;
    context += `Sections:\n`;
    curriculum.examPattern.sections.forEach(section => {
      context += `- ${section.name}: ${section.marks} marks (${section.questionTypes.join(', ')})\n`;
    });
    context += `\n`;

    context += `CHAPTERS TO FOCUS ON:\n`;
    chapters.forEach(chapter => {
      if (chapter) {
        context += `Chapter ${chapter.number}: ${chapter.title}\n`;
        if (request.language === 'urdu' && chapter.titleUrdu) {
          context += `اردو: ${chapter.titleUrdu}\n`;
        }
        context += `Topics: ${chapter.topics.join(', ')}\n`;
        if (chapter.keyFormulas && chapter.keyFormulas.length > 0) {
          context += `Key Formulas: ${chapter.keyFormulas.join(', ')}\n`;
        }
        context += `Important Concepts: ${chapter.importantConcepts.join(', ')}\n`;
        context += `Learning Objectives: ${chapter.learningObjectives.join(', ')}\n\n`;
      }
    });

    context += `PAST PAPER ANALYSIS:\n`;
    context += `Based on ${pastPapers.length} past paper questions from recent years:\n`;
    
    // Analyze question patterns
    const mcqCount = pastPapers.filter(q => q.type === 'MCQ').length;
    const shortCount = pastPapers.filter(q => q.type === 'Short Answer').length;
    const longCount = pastPapers.filter(q => q.type === 'Long Answer').length;
    const numericalCount = pastPapers.filter(q => q.type === 'Numerical').length;
    
    context += `- MCQ Questions: ${mcqCount}\n`;
    context += `- Short Answer Questions: ${shortCount}\n`;
    context += `- Long Answer Questions: ${longCount}\n`;
    context += `- Numerical Problems: ${numericalCount}\n\n`;

    // Add sample questions for reference
    if (pastPapers.length > 0) {
      context += `SAMPLE PAST PAPER QUESTIONS (for style reference):\n`;
      pastPapers.slice(0, 3).forEach((paper, index) => {
        context += `${index + 1}. [${paper.year} - ${paper.type}] ${paper.questionText}\n`;
        if (paper.options) {
          context += `   a) ${paper.options.a} b) ${paper.options.b} c) ${paper.options.c} d) ${paper.options.d}\n`;
        }
        if (paper.solution) {
          context += `   Solution: ${paper.solution}\n`;
        }
        context += `\n`;
      });
    }

    return context;
  }

  async generateQuiz(request: QuizGenerationRequest): Promise<QuizResponse> {
    try {
      const context = await this.buildContextPrompt(request);
      
      const prompt = `${context}

TASK: Generate ${request.questionCount} high-quality exam questions based on the above curriculum and past paper patterns.

REQUIREMENTS:
- Question Types: ${request.questionTypes.join(', ')}
- Difficulty Level: ${request.difficulty}
- Language: ${request.language}
- Must align with ${request.board} Board exam patterns
- Include proper solutions and explanations
- For MCQs, provide 4 options with one correct answer
- For numerical problems, include step-by-step solutions
- Questions should test understanding, not just memorization

DISTRIBUTION:
${request.questionTypes.map(type => {
  const count = Math.ceil(request.questionCount / request.questionTypes.length);
  return `- ${type}: ${count} questions`;
}).join('\n')}

OUTPUT FORMAT (JSON):
{
  "questions": [
    {
      "id": "unique_id",
      "type": "MCQ|Short Answer|Long Answer|Numerical",
      "questionText": "Question in English",
      "questionTextUrdu": "Question in Urdu (if language is urdu)",
      "options": {"a": "option1", "b": "option2", "c": "option3", "d": "option4"} // only for MCQ,
      "correctAnswer": "a|b|c|d", // only for MCQ
      "solution": "Detailed solution in English",
      "solutionUrdu": "Detailed solution in Urdu (if language is urdu)",
      "marks": number,
      "difficulty": "easy|medium|hard",
      "chapterId": "chapter_id",
      "topic": "specific topic",
      "learningObjective": "what this question tests"
    }
  ]
}

Generate questions that are:
1. Aligned with the official curriculum
2. Similar in style to past papers
3. Appropriate for the difficulty level
4. Educationally valuable
5. Clear and unambiguous

Start generating now:`;

      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are an expert Pakistani board exam question generator. Generate high-quality, curriculum-aligned questions in the exact JSON format requested."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Parse the JSON response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from AI');
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);
      
      // Calculate total marks and estimated time
      const totalMarks = parsedResponse.questions.reduce((sum: number, q: any) => sum + q.marks, 0);
      const estimatedTime = Math.ceil(totalMarks * 2); // 2 minutes per mark

      return {
        questions: parsedResponse.questions,
        totalMarks,
        estimatedTime,
        metadata: {
          subject: request.subject,
          board: request.board,
          grade: request.grade,
          chapters: request.chapterIds,
          generatedAt: new Date()
        }
      };

    } catch (error) {
      console.error('Error generating quiz:', error);
      throw new Error(`Failed to generate quiz: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateStudyPlan(
    subject: Subject,
    board: Board,
    grade: Grade,
    examDate: Date,
    weeklyHours: number,
    language: 'english' | 'urdu'
  ) {
    const curriculum = getCurriculum(subject, board, grade);
    if (!curriculum) {
      throw new Error(`Curriculum not found for ${subject} ${grade} ${board}`);
    }

    const weeksUntilExam = Math.ceil((examDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 7));
    const totalAvailableHours = weeksUntilExam * weeklyHours;

    const prompt = `You are an expert study planner for Pakistani board exams.

STUDENT DETAILS:
- Subject: ${subject}
- Board: ${board}
- Grade: ${grade}
- Exam Date: ${examDate.toDateString()}
- Weeks until exam: ${weeksUntilExam}
- Weekly study hours available: ${weeklyHours}
- Total available hours: ${totalAvailableHours}
- Language preference: ${language}

CURRICULUM:
${curriculum.chapters.map(ch => 
  `Chapter ${ch.number}: ${ch.title} (${ch.estimatedStudyHours}h) - ${ch.topics.join(', ')}`
).join('\n')}

EXAM PATTERN:
- Total Marks: ${curriculum.examPattern.totalMarks}
- Time: ${curriculum.examPattern.timeLimit} minutes
- Sections: ${curriculum.examPattern.sections.map(s => `${s.name} (${s.marks} marks)`).join(', ')}

Create a detailed week-by-week study plan that:
1. Covers all chapters systematically
2. Allocates time based on chapter difficulty and importance
3. Includes regular revision cycles
4. Incorporates practice tests and past papers
5. Builds up intensity as exam approaches
6. Accounts for Pakistani board exam patterns

Provide the plan in JSON format with weekly breakdowns, daily sessions, and specific learning objectives.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert Pakistani education consultant specializing in board exam preparation."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000
    });

    return response.choices[0].message.content;
  }

  async explainConcept(
    concept: string,
    subject: Subject,
    grade: Grade,
    language: 'english' | 'urdu'
  ) {
    const prompt = `Explain the concept "${concept}" for ${grade} grade ${subject} students in Pakistan.

Requirements:
- Use simple, clear language appropriate for ${grade} grade level
- Include relevant examples from Pakistani context
- Provide step-by-step explanations where applicable
- Include any important formulas or equations
- Connect to real-world applications
- Language: ${language}
- Follow Pakistani curriculum standards

Make the explanation engaging and easy to understand.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an expert ${subject} teacher in Pakistan, known for making complex concepts simple and relatable.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    return response.choices[0].message.content;
  }
}

export const aiQuizAgent = new AIQuizAgent();