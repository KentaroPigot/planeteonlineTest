import { Model, ModelStatic } from "sequelize";
import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { GetAllOptions } from "../@types/controllers/handlerFactory";
import APIFeatures from "../utils/apiFeatures";

const getAll = (
  Model: ModelStatic<Model>,
  { include = [], ...defaultOptions }: GetAllOptions = {}
) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const features = new APIFeatures(req.query).sort();

    const queryOptions = {
      ...defaultOptions,
      include,
      ...features.buildQuery(),
    };

    const docs = await Model.findAll(queryOptions);

    // if (!docs || docs.length === 0) {
    //   return next(new AppError("Pas de document trouvé", 404));
    // }

    res.status(200).json({
      status: "success",
      results: docs.length,
      data: docs,
    });
  });
};

const getOne = (Model: ModelStatic<Model>) => {
  return catchAsync(async function (req, res, next) {
    const doc = await Model.findByPk(req.params.id);

    if (!doc) {
      return next(new AppError("Pas de document trouvé avec cet id", 404));
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });
};

const deleteOne = (Model: ModelStatic<Model>) => {
  return catchAsync(async function (req, res, next) {
    const doc = await Model.findByPk(req.params.id);

    if (!doc) {
      return next(new AppError("Pas de document trouvé avec cet id", 404));
    }

    await doc.destroy();
    res.status(200).json({
      status: "success",
      data: null,
    });
  });
};

const updateOne = (Model: ModelStatic<Model>) => {
  return catchAsync(async function (req, res, next) {
    const doc = await Model.findByPk(req.params.id);

    if (!doc) {
      return next(new AppError("Pas de document trouvé avec cet id", 404));
    }

    await doc.update(req.body);

    res.status(201).json({
      status: "success",
      data: doc,
    });
  });
};

const createOne = (Model: ModelStatic<Model>) => {
  return catchAsync(async function (req, res, next) {
    const doc = await Model.create(req.body);

    if (!doc) {
      return next(new AppError("Erreur en créant le document", 400));
    }

    res.status(201).json({
      status: "success",
      data: doc,
    });
  });
};

const sendResponse = (req: Request, res: Response) => {
  const response = res.locals.response;

  res.status(201).json({
    status: "success",
    data: {
      response,
    },
  });
};

export default {
  getAll,
  getOne,
  deleteOne,
  updateOne,
  createOne,
  sendResponse,
};
