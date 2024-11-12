import { Video } from "../models/video.model.js";
import { okResponse } from "../utils/handlerError.utils.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.utils.js";
import { uploadClaudhinaryFile } from "../utils/claudhinary.utils.js";
import { getVideoDuration } from "../utils/videoDuration.cloudhinary.utils.js";
const getAllVideos = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      query,
      sortBy = "createdAt",
      sortType = "desc",
      userId,
    } = req.query;
    let matchConditons = {};

    if (query) {
      matchConditons = {
        $text: { $search: query },
      };
    }

    if (userId) {
      matchConditons.owner = new mongoose.Types.ObjectId(userId);
    }

    const aggregateQuery = [
      {
        $match: matchConditons,
      },
      {
        $sort: {
          [sortBy]: sortType === "asc" ? 1 : -1,
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: parseInt(limit),
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerDetails",
        },
      },
      {
        $project: {
          videoFile: 1,
          thumbnail: 1,
          title: 1,
          description: 1,
          duration: 1,
          duration: 1,
          isPublished: 1,
          owner: 1,
          ownerDetails: { username: 1 },
          createdAt: 1,
        },
      },
    ];

    const video = await Video.aggregatePaginate(aggregateQuery, {
      page,
      limit,
    });

    const totalCounts = await Video.countDocuments(matchConditons);
    const totalPage = Math.ceil(totalCounts / parseInt(limit));
    return okResponse(
      res,
      "get All videos Fetched Successfully ",
      { video, totalCounts, totalPage, page, limit },
      200
    );
  } catch (error) {
    console.log("ERROR IN GET ALL VIDEOS", error);
  }
};

const getVideoById = async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError("Video not found sorry ", 401);
    }
    return okResponse(res, "get All videos Fetched Successfully ", video, 200);
  } catch (error) {
    console.log("ERROR IN GET VIDEO BY ID", error);
  }
};

const publishAVideo = async (req, res) => {
  try {
    const { title, description } = req.body;
    if ([title, description].some((field) => field?.trim() === "")) {
      throw new ApiError("title and description is required", 401);
    }
    const videofile = req.files?.video[0].path;
    const thumbnail = req.files?.thumbnail[0].path;
    if (!(videofile || thumbnail)) {
      throw new ApiError(
        "video and thumbnail is required for creating a video ",
        400
      );
    }
    const videoDuration = await getVideoDuration(videofile);
    if (!videoDuration || isNaN(videoDuration) || videoDuration <= 0) {
      throw new ApiError("video is missing ", 409);
    }
    const uploadVideo = await uploadClaudhinaryFile(videofile);
    const uploadThumbnail = await uploadClaudhinaryFile(thumbnail);
    if (!(uploadVideo || uploadThumbnail)) {
      throw new ApiError("uploading video and thumbnail error", 402);
    }
    const video = await Video.create({
      title,
      description,
      duration: videoDuration,
      videoFile: uploadVideo,
      thumbnail: uploadThumbnail,
      owner: req.user?._id,
    });
    return okResponse(res, "upload video Successfully ", video, 200);
  } catch (error) {
    console.log("ERROR IN PUBLISH A VIDEO : ", error);
  }
};

export { getAllVideos, getVideoById, publishAVideo };
