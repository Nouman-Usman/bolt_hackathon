import { useState } from 'react';
import { aiQuizAgent, QuizGenerationRequest, QuizResponse } from '../services/aiAgents';

export const useAIQuiz = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuiz = async (request: QuizGenerationRequest): Promise<QuizResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const quiz = await aiQuizAgent.generateQuiz(request);
      return quiz;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate quiz';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateStudyPlan = async (
    subject: any,
    board: any,
    grade: any,
    examDate: Date,
    weeklyHours: number,
    language: 'english' | 'urdu'
  ) => {
    setLoading(true);
    setError(null);

    try {
      const plan = await aiQuizAgent.generateStudyPlan(
        subject,
        board,
        grade,
        examDate,
        weeklyHours,
        language
      );
      return plan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate study plan';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const explainConcept = async (
    concept: string,
    subject: any,
    grade: any,
    language: 'english' | 'urdu'
  ) => {
    setLoading(true);
    setError(null);

    try {
      const explanation = await aiQuizAgent.explainConcept(concept, subject, grade, language);
      return explanation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to explain concept';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateQuiz,
    generateStudyPlan,
    explainConcept,
    loading,
    error
  };
};