import { db } from '../firebase';
import { collection, addDoc, query, where, orderBy, getDocs, doc, deleteDoc } from 'firebase/firestore';

/**
 * Save analysis result to Firestore
 */
export const saveAnalysisToHistory = async (userId, analysisData) => {
  try {
    const historyRef = collection(db, 'analysisHistory');
    
    const docData = {
      userId: userId,
      timestamp: new Date().toISOString(),
      numberOfImages: analysisData.images?.length || 1,
      results: analysisData.results,
      images: analysisData.images || [], // Store image URLs or base64
      language: analysisData.language || 'en', // Store language code
      languageName: analysisData.languageName || 'English', // Store language name
      createdAt: new Date(),
    };

    const docRef = await addDoc(historyRef, docData);
    
    return {
      success: true,
      documentId: docRef.id,
      message: 'Analysis saved to history successfully'
    };
  } catch (error) {
    console.error('Error saving to history:', error);
    return {
      success: false,
      error: error.message || 'Failed to save analysis'
    };
  }
};

/**
 * Get all analysis history for a user
 */
export const getUserAnalysisHistory = async (userId) => {
  try {
    const historyRef = collection(db, 'analysisHistory');
    const q = query(
      historyRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const history = [];

    querySnapshot.forEach((doc) => {
      history.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return {
      success: true,
      history: history,
      count: history.length
    };
  } catch (error) {
    console.error('Error fetching history:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch history',
      history: []
    };
  }
};

/**
 * Delete a specific analysis from history
 */
export const deleteAnalysisFromHistory = async (documentId) => {
  try {
    await deleteDoc(doc(db, 'analysisHistory', documentId));
    return {
      success: true,
      message: 'Analysis deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting analysis:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete analysis'
    };
  }
};

/**
 * Get analysis statistics for a user
 */
export const getUserStatistics = async (userId) => {
  try {
    const historyData = await getUserAnalysisHistory(userId);
    
    if (!historyData.success) {
      return historyData;
    }

    const history = historyData.history;
    let totalScans = 0;
    let healthyPlants = 0;
    let diseasedPlants = 0;

    history.forEach(item => {
      item.results?.forEach(result => {
        totalScans++;
        if (result.diseasePresent) {
          diseasedPlants++;
        } else {
          healthyPlants++;
        }
      });
    });

    const successRate = totalScans > 0 
      ? Math.round((healthyPlants / totalScans) * 100) 
      : 0;

    return {
      success: true,
      stats: {
        totalScans,
        healthyPlants,
        diseasedPlants,
        successRate,
        totalAnalyses: history.length
      }
    };
  } catch (error) {
    console.error('Error calculating statistics:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
