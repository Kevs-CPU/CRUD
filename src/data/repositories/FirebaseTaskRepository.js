import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";

const COLLECTION_NAME = "tasks";

export class FirebaseTaskRepository {
  async getAll(userId) {
    try {
      if (!userId) {
        console.error("getAll requires userId");
        return [];
      }

      const q = query(
        collection(db, COLLECTION_NAME),
        where("userId", "==", userId)
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      return [];
    }
  }

  async getById(id) {
    try {
      if (!id) {
        throw new Error("Task ID is required");
      }

      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        };
      }
      return null;
    } catch (error) {
      console.error("Failed to get task:", error);
      throw error;
    }
  }

  // ✅ Added: matches the `findByGmail` method declared in TaskRepository interface.
  // Returns the first task found with a matching gmail, or null if none found.
  async findByGmail(gmail) {
    try {
      if (!gmail) {
        throw new Error("Gmail is required");
      }

      const cleanGmail = gmail.trim().toLowerCase();

      const q = query(
        collection(db, COLLECTION_NAME),
        where("gmail", "==", cleanGmail)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return null;
      }

      const docSnap = snapshot.docs[0];
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    } catch (error) {
      console.error("Failed to find task by gmail:", error);
      throw error;
    }
  }

  async add(task) {
    try {
      await setDoc(doc(db, COLLECTION_NAME, task.id), task);
      return task;
    } catch (error) {
      console.error("Failed to add task:", error);
      throw error;
    }
  }

  async update(task) {
    try {
      const taskRef = doc(db, COLLECTION_NAME, task.id);

      const updateData = {};

      if (task.title !== undefined) {
        updateData.title = task.title;
      }

      if (task.completed !== undefined) {
        updateData.completed = task.completed;
      }

      updateData.updatedAt = new Date().toISOString();

      await updateDoc(taskRef, updateData);

      return task;
    } catch (error) {
      console.error("Failed to update task:", error);
      throw error;
    }
  }

  async remove(id) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      return id;
    } catch (error) {
      console.error("Failed to remove task:", error);
      throw error;
    }
  }
}