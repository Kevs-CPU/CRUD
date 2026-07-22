import { db } from "../../firebase/config";
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

const COLLECTION_NAME = "tasks";

export class FirebaseTaskRepository {
  async getAll(userId) {
    console.log("[FirebaseTaskRepository] getAll started:", userId);

    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const q = query(
        collection(db, COLLECTION_NAME),
        where("userId", "==", userId)
      );

      const snapshot = await getDocs(q);

      const tasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("[FirebaseTaskRepository] getAll success:", tasks);

      return tasks;
    } catch (error) {
      console.error("[FirebaseTaskRepository] getAll failed:", error);
      throw error;
    }
  }

  async getById(id) {
    console.log("[FirebaseTaskRepository] getById started:", id);

    try {
      if (!id) {
        throw new Error("Task ID is required");
      }

      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.log(
          "[FirebaseTaskRepository] getById: Task not found",
          id
        );

        return null;
      }

      const task = {
        id: docSnap.id,
        ...docSnap.data(),
      };

      console.log("[FirebaseTaskRepository] getById success:", task);

      return task;
    } catch (error) {
      console.error("[FirebaseTaskRepository] getById failed:", error);
      throw error;
    }
  }

  async findByGmail(gmail) {
    console.log("[FirebaseTaskRepository] findByGmail started:", gmail);

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
        console.log(
          "[FirebaseTaskRepository] findByGmail: No task found"
        );

        return null;
      }

      const docSnap = snapshot.docs[0];

      const task = {
        id: docSnap.id,
        ...docSnap.data(),
      };

      console.log(
        "[FirebaseTaskRepository] findByGmail success:",
        task
      );

      return task;
    } catch (error) {
      console.error(
        "[FirebaseTaskRepository] findByGmail failed:",
        error
      );

      throw error;
    }
  }

  async add(task) {
    console.log(
      "[FirebaseTaskRepository] add started:",
      task.id
    );

    try {
      await setDoc(
        doc(db, COLLECTION_NAME, task.id),
        task
      );

      console.log(
        "[FirebaseTaskRepository] add success:",
        task.id
      );

      return task;
    } catch (error) {
      console.error(
        "[FirebaseTaskRepository] add failed:",
        error
      );

      throw error;
    }
  }

  async update(task) {
    console.log(
      "[FirebaseTaskRepository] update started:",
      task.id
    );

    try {
      const taskRef = doc(
        db,
        COLLECTION_NAME,
        task.id
      );

      const updateData = {};

      if (task.title !== undefined) {
        updateData.title = task.title;
      }

      if (task.completed !== undefined) {
        updateData.completed = task.completed;
      }

      updateData.updatedAt = new Date().toISOString();

      await updateDoc(
        taskRef,
        updateData
      );

      console.log(
        "[FirebaseTaskRepository] update success:",
        task.id
      );

      return task;
    } catch (error) {
      console.error(
        "[FirebaseTaskRepository] update failed:",
        error
      );

      throw error;
    }
  }

  async remove(id) {
    console.log(
      "[FirebaseTaskRepository] remove started:",
      id
    );

    try {
      await deleteDoc(
        doc(db, COLLECTION_NAME, id)
      );

      console.log(
        "[FirebaseTaskRepository] remove success:",
        id
      );

      return id;
    } catch (error) {
      console.error(
        "[FirebaseTaskRepository] remove failed:",
        error
      );

      throw error;
    }
  }
}