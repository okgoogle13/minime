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
    console.error("Error fetching user profile:", error);
    throw new Error("Could not fetch user profile.");
  }
};

export const saveUserProfile = async (userId: string, profile: UserProfile): Promise<void> => {
  try {
    const docRef = db.collection(USER_PROFILES_COLLECTION).doc(userId);
    await docRef.set(profile, { merge: true });
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw new Error("Could not save user profile.");
  }
};
