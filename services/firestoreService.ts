
import { db } from '../firebaseConfig';
import type { UserProfile } from '../types';

const USER_PROFILES_COLLECTION = 'userProfiles';

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const docRef = db.collection(USER_PROFILES_COLLECTION).doc(userId);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("[FirestoreService] Error fetching user profile:", error);
    throw new Error("Unable to retrieve your profile. Please check your connection.");
  }
};

export const saveUserProfile = async (userId: string, profile: UserProfile): Promise<void> => {
  try {
    const docRef = db.collection(USER_PROFILES_COLLECTION).doc(userId);
    await docRef.set(profile, { merge: true });
  } catch (error) {
    console.error("[FirestoreService] Error saving user profile:", error);
    throw new Error("Failed to save changes to your profile. Cloud storage may be unavailable.");
  }
};
