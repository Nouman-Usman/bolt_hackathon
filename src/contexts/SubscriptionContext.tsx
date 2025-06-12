import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../lib/supabase';
import { PlanType, SubscriptionPlan, AddOn, Campaign, UserSubscription } from '../types/subscription';

interface SubscriptionContextType {
  currentPlan: PlanType;
  subscription: UserSubscription | null;
  isLoading: boolean;
  campaigns: Campaign[];
  activeCampaign: Campaign | null;
  upgradeToplan: (planId: string) => Promise<void>;
  purchaseAddOn: (addOnId: string) => Promise<void>;
  checkFeatureAccess: (feature: string) => boolean;
  getRemainingQuota: (feature: string) => number;
  getDiscountedPrice: (originalPrice: number, planType: PlanType) => number;
  isInstitutionalUser: boolean;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  currentPlan: 'free',
  subscription: null,
  isLoading: false,
  campaigns: [],
  activeCampaign: null,
  upgradeToplan: async () => {},
  purchaseAddOn: async () => {},
  checkFeatureAccess: () => false,
  getRemainingQuota: () => 0,
  getDiscountedPrice: (price) => price,
  isInstitutionalUser: false,
  refreshSubscription: async () => {},
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<PlanType>('free');
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [isInstitutionalUser, setIsInstitutionalUser] = useState(false);

  // Load user subscription and campaigns
  useEffect(() => {
    if (user) {
      loadUserSubscription();
      loadCampaigns();
    }
  }, [user]);

  const loadUserSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await db.getUserSubscription(user.id);
      if (error) {
        console.error('Error loading subscription:', error);
        return;
      }

      if (data) {
        setSubscription({
          id: data.id,
          userId: data.user_id!,
          planType: data.plan_type as PlanType,
          status: data.status as any,
          startDate: new Date(data.start_date!),
          endDate: data.end_date ? new Date(data.end_date) : new Date(),
          autoRenew: data.auto_renew || false,
        });
        setCurrentPlan(data.plan_type as PlanType);
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  };

  const loadCampaigns = async () => {
    try {
      const { data, error } = await db.getActiveCampaigns();
      if (error) {
        console.error('Error loading campaigns:', error);
        return;
      }

      if (data) {
        const campaignData = data.map(campaign => ({
          id: campaign.id,
          name: campaign.name,
          nameUrdu: campaign.name_urdu,
          type: campaign.type as any,
          discountPercentage: campaign.discount_percentage,
          validFrom: new Date(campaign.valid_from),
          validTo: new Date(campaign.valid_to),
          applicablePlans: campaign.applicable_plans as PlanType[],
          active: campaign.active || false,
          description: campaign.description || '',
          descriptionUrdu: campaign.description_urdu || '',
          sponsorName: campaign.sponsor_name || undefined,
          targetAudience: campaign.target_audience || undefined,
        }));

        setCampaigns(campaignData);
        setActiveCampaign(campaignData.find(c => c.active) || null);
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
    }
  };

  const refreshSubscription = async () => {
    await loadUserSubscription();
  };

  const upgradeToplan = async (planId: string) => {
    setIsLoading(true);
    try {
      // Implementation for plan upgrade
      console.log('Upgrading to plan:', planId);
      // In real app, this would integrate with Stripe and update the database
    } catch (error) {
      console.error('Error upgrading plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseAddOn = async (addOnId: string) => {
    setIsLoading(true);
    try {
      // Implementation for add-on purchase
      console.log('Purchasing add-on:', addOnId);
      // In real app, this would integrate with Stripe and update the database
    } catch (error) {
      console.error('Error purchasing add-on:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkFeatureAccess = (feature: string): boolean => {
    const featureMap: Record<PlanType, string[]> = {
      free: ['basic_quizzes', 'limited_subjects', 'community_support'],
      premium_monthly: ['all_subjects', 'unlimited_quizzes', 'ai_tutor', 'analytics', 'essay_grading', 'study_plans'],
      premium_yearly: ['all_subjects', 'unlimited_quizzes', 'ai_tutor', 'analytics', 'essay_grading', 'study_plans', 'bootcamps', 'live_sessions'],
      institutional_basic: ['all_subjects', 'unlimited_quizzes', 'ai_tutor', 'basic_analytics', 'teacher_dashboard'],
      institutional_premium: ['all_subjects', 'unlimited_quizzes', 'ai_tutor', 'advanced_analytics', 'teacher_dashboard', 'admin_dashboard', 'custom_content'],
      enterprise: ['all_subjects', 'unlimited_quizzes', 'ai_tutor', 'advanced_analytics', 'teacher_dashboard', 'admin_dashboard', 'custom_content', 'api_access', 'white_label']
    };

    return featureMap[currentPlan]?.includes(feature) || false;
  };

  const getRemainingQuota = (feature: string): number => {
    const quotaMap: Record<PlanType, Record<string, number>> = {
      free: { subjects: 2, quizzes: 5, aiQueries: 10 },
      premium_monthly: { subjects: -1, quizzes: -1, aiQueries: -1 },
      premium_yearly: { subjects: -1, quizzes: -1, aiQueries: -1 },
      institutional_basic: { subjects: -1, quizzes: -1, aiQueries: -1, students: 100 },
      institutional_premium: { subjects: -1, quizzes: -1, aiQueries: -1, students: 500 },
      enterprise: { subjects: -1, quizzes: -1, aiQueries: -1, students: -1 }
    };

    return quotaMap[currentPlan]?.[feature] || 0;
  };

  const getDiscountedPrice = (originalPrice: number, planType: PlanType): number => {
    if (!activeCampaign || !activeCampaign.applicablePlans.includes(planType)) {
      return originalPrice;
    }
    
    const discount = (originalPrice * activeCampaign.discountPercentage) / 100;
    return originalPrice - discount;
  };

  return (
    <SubscriptionContext.Provider
      value={{
        currentPlan,
        subscription,
        isLoading,
        campaigns,
        activeCampaign,
        upgradeToplan,
        purchaseAddOn,
        checkFeatureAccess,
        getRemainingQuota,
        getDiscountedPrice,
        isInstitutionalUser,
        refreshSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};