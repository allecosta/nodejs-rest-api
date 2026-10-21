import { Request, Response } from "express";
import Tutorial from "../models/Tutorial";
import tutorialRepository from "../repositories/tutorialRepository";

export default class TutorialController {

  async create(req: Request, res: Response) {
    if (!req.body.title) {
      res.status(400).send({
        message: "OPS! Content can not be empty!"
      });
      return;
    }

    try {
      const tutorial: Tutorial = req.body;
      const savedTutorial = await tutorialRepository.save(tutorial);
      res.status(201).send(savedTutorial);

    } catch (err) {
      res.status(500).send({
        message: "OPS! Some error occurred while retrieving tutorials."
      });
    }
  }

  async findAll(req: Request, res: Response) {
    const title = typeof req.query.title === "string" ? req.query.title : "";

    try {
      const tutorials = await tutorialRepository.retrieveAll({ title: title });
      res.status(200).send(tutorials);

    } catch (err) {
      res.status(500).send({
        message: "OPS! Some error occurred while retrieving tutorials."
      });
    }
  }

  async findOne(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const tutorial = await tutorialRepository.retrieveById(id);

      if (tutorial) 
        res.status(200).send(tutorial);
      else
        res.status(404).send({
          message: `OPS! Cannot find tutorial with ID ${id}`
        });

    } catch (err) {
      res.status(500).send({
        message: `OPS! Error retrieving tutorial with ID ${id}`
      });
    }
  }

  async update(req: Request, res: Response) {
    let tutorial: Tutorial = req.body;
    tutorial.id = parseInt(req.params.id);

    try {
      const num = await tutorialRepository.update(tutorial);

      if (num == 1)
        res.send({ message: "WIN! Tutorial was updated successfully." });
      else
        res.send({
          message: `OPS! Cannot update tutorial with ID ${tutorial.id}. Maybe tutorial was not found or req.body is empty!`
        });

    } catch (err) {
      res.status(500).send({
        message: `OPS! Error updating tutorial with ID ${tutorial.id}`
      });
    }
  }

  async delete(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const num = await tutorialRepository.delete(id);

      if (num == 1) 
        res.send({ message: "WINS! Tutorial was deleted successfully!" });
       else 
        res.send({
          message: `OPS! Cannot delete Tutorial with ID ${id}. Maybe tutorial was not found!`,
        });

    } catch (err) {
      res.status(500).send({
        message: `OPS! Could not delete tutorial with ID ${id}`
      });
    }
  }

  async deleteAll(req: Request, res: Response) {
    try {
      const num = await tutorialRepository.deleteAll();
      res.send({ message: `${num} Tutorials were deleted successfully!` });

    } catch (err) {
      res.status(500).send({
        message: "OPS! Some error occurred while removing all tutorials."
      });
    }
  }

  async findAllPublished(req: Request, res: Response) {
    try {
      const tutorials = await tutorialRepository.retrieveAll({ published: true });
      res.status(200).send(tutorials);

    } catch (err) {
      res.status(500).send({
        message: "OPS! Some error occurred while retrieving tutorials."
      });
    }
  }
}
