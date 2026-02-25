
import type { UserProfile } from '../types';

const LOCAL_STORAGE_KEY = 'resume_copilot_profile';

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("[LocalService] Error fetching user profile:", error);
    throw new Error("Unable to retrieve your profile from local storage.");
  }
};

export const saveUserProfile = async (userId: string, profile: UserProfile): Promise<void> => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error("[LocalService] Error saving user profile:", error);
    throw new Error("Failed to save changes to your profile in local storage.");
  }
};
