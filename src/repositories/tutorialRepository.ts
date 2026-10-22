import { ResultSetHeader  } from "mysql2";
import conn from "../db";
import Tutorial from "../models/Tutorial";

interface ITutorialRepository {
    save(tutorial: Tutorial): Promise<Tutorial>;
    retrieveAll(searchParams: { title: string, published: boolean }): Promise<Tutorial[]>;
    retrieveById(tutorialId: number): Promise<Tutorial | undefined>;
    update(tutorial: Tutorial): Promise<number>;
    delete(tutorialId: number): Promise<number>;
    deleteAll(): Promise<number>;
}

class TutorialRepository implements ITutorialRepository {
    save(tutorial: Tutorial): Promise<Tutorial> {
        return new Promise((resolve, reject) => {
            conn.query<ResultSetHeader >(
                "INSERT INTO tutorials (title, description, published) VALUES(?,?,?)",
                [tutorial.title, tutorial.description, tutorial.published ? tutorial.published : false],
                (err, res) => {
                    if (err) 
                        reject(err);
                    else
                        this.retrieveById(res.insertId)
                        .then((tutorial) => resolve(tutorial!))
                        .catch(reject);
                }
            );
        });
    }

    retrieveAll(searchParams: { title?: string, published?: boolean }): Promise<Tutorial[]> {
        let query: string = "SELECT * FROM tutorials";
        let conditions: string[] = [];
        let values: (string | boolean)[] = [];

        if (searchParams?.published)
            conditions.push("published = TRUE");

        if (searchParams?.title) {
            conditions.push("LOWER(title) LIKE ?");
            values.push(`%${searchParams.title.toLowerCase()}%`);
        }

        if (conditions.length)
            query += " WHERE " + conditions.join(" AND ");

        return new Promise((resolve, reject) => {
            conn.query<Tutorial[]>(query, values, (err, res) => {
                if (err) 
                    reject(err);
                else 
                    resolve(res);
            });
        });
    }

    retrieveById(tutorialId: number): Promise<Tutorial> {
        return new Promise((resolve, reject) => {
            conn.query<Tutorial[]>(
                "SELECT * FROM tutorials WHERE id = ?",
                [tutorialId],
                (err, res) => {
                    if (err) 
                        reject(err);
                    else 
                        resolve(res?.[0]);
                }
            );
        });
    }

    update(tutorial: Tutorial): Promise<number> {
        return new Promise((resolve, reject) => {
            conn.query<ResultSetHeader >(
                "UPDATE tutorials SET title = ?, description = ?, published = ? WHERE id = ?",
                [tutorial.title, tutorial.description, tutorial.published, tutorial.id],
                (err, res) => {
                    if (err) 
                        reject(err);
                    else 
                        resolve(res.affectedRows);
                }
            );
        });
    }

    delete(tutorialId: number): Promise<number> {
        return new Promise((resolve, reject) => {
            conn.query<ResultSetHeader >(
                "DELETE FROM tutorials WHERE id = ?",
                [tutorialId],
                (err, res) => {
                    if (err) 
                        reject(err);
                    else 
                        resolve(res.affectedRows);
                }
            );
        });
    }

    deleteAll(): Promise<number> {
        return new Promise((resolve, reject) => {
            conn.query<ResultSetHeader >("DELETE FROM tutorials", (err, res) => {
                if (err) 
                    reject(err);
                else 
                    resolve(res.affectedRows);
            });
        });
    }
}

export default new TutorialRepository();
