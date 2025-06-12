export type PlanType = 'free' | 'premium_monthly' | 'premium_yearly' | 'institutional_basic' | 'institutional_premium' | 'enterprise';
export type UserRole = 'student' | 'teacher' | 'admin' | 'parent';
export type CampaignType = 'seasonal' | 'exam_rush' | 'ramadan' | 'sponsorship' | 'rural_support';

export interface SubscriptionPlan {
  id: string;
  name: string;
  nameUrdu: string;
  type: PlanType;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: {
    english: string[];
    urdu: string[];
  };
  limits: {
    subjects: number; // -1 for unlimited
    quizzes: number;
    aiQueries: number;
    students?: number; // For institutional plans
    teachers?: number;
    analytics?: boolean;
    liveSupport?: boolean;
  };
  popular?: boolean;
  stripePriceId: string;
  category: 'individual' | 'institutional';
  savings?: string; // e.g., "Save 20%"
}

export interface AddOn {
  id: string;
  name: string;
  nameUrdu: string;
  description: string;
  descriptionUrdu: string;
  price: number;
  currency: string;
  type: 'bootcamp' | 'tutoring' | 'papers' | 'course' | 'mentoring';
  duration?: number; // in days
  sessions?: number; // for tutoring
  stripePriceId: string;
  popular?: boolean;
}

export interface Institution {
  id: string;
  name: string;
  type: 'school' | 'coaching_center' | 'university' | 'madrassa';
  studentCount: number;
  adminUsers: string[];
  teacherUsers: string[];
  subscriptionPlan: PlanType;
  features: string[];
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  address: {
    city: string;
    province: string;
    country: string;
  };
}

export interface Campaign {
  id: string;
  name: string;
  nameUrdu: string;
  type: CampaignType;
  discountPercentage: number;
  validFrom: Date;
  validTo: Date;
  applicablePlans: PlanType[];
  active: boolean;
  description: string;
  descriptionUrdu: string;
  sponsorName?: string; // For sponsorship campaigns
  targetAudience?: string; // e.g., "rural students", "exam candidates"
}

export interface UserSubscription {
  id: string;
  userId: string;
  planType: PlanType;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentMethod?: string;
  institutionId?: string; // If user is part of an institution
}