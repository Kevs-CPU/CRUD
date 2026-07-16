import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../firebase/config";

const COLLECTION_NAME = "tasks";

export class FirebaseTaskRepository {
  async getAll() {
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));

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
      const snapshot = await getDoc(doc(db, COLLECTION_NAME, id));

      if (!snapshot.exists()) {
        return null;
      }

      return {
        id: snapshot.id,
        ...snapshot.data(),
      };
    } catch (error) {
      console.error("Failed to get task:", error);
      return null;
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

      await updateDoc(taskRef, {
        gmail: task.gmail,
        title: task.title,
        completed: task.completed,
      });

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

  async findByGmail(gmail) {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("gmail", "==", gmail)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return null;
      }

      const taskDoc = snapshot.docs[0];

      return {
        id: taskDoc.id,
        ...taskDoc.data(),
      };
    } catch (error) {
      console.error("Failed to find task by gmail:", error);
      return null;
    }
  }
}