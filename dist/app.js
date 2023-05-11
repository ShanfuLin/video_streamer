"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const video_streamer_class_1 = __importDefault(require("./video_streamer_class"));
const parse_stream_info_function_1 = require("./parse_stream_info_function");
const prep_fytp_moov_1 = require("./prep_fytp_moov");
const prep_moof_mdat_1 = require("./prep_moof_mdat");
const myVideoStreamerInstance = new video_streamer_class_1.default("rtsp://justinn.lc4i.club:8554/ivh-pudo-2", 4001);
// const outputFile: fs.WriteStream = fs.createWriteStream("ffmpeg_output.bin");
const wss = myVideoStreamerInstance.wss;
wss.on("connection", (ws) => {
    console.log("Client connected");
    if (myVideoStreamerInstance.initialization_segment_ready_flag) {
        wss.clients.forEach((client) => {
            client.send(new Uint8Array(myVideoStreamerInstance.initialization_segment_to_send).buffer);
            console.log("Sent initialization segment to clients");
        });
    }
    if (myVideoStreamerInstance.buffered_media_segment_ready_flag) {
        wss.clients.forEach((client) => {
            client.send(new Uint8Array(myVideoStreamerInstance.buffered_media_segment_to_send).buffer);
        });
    }
    ws.on("close", () => {
        console.log("Client disconnected");
    });
    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });
});
const ffmpeg = (0, child_process_1.spawn)("ffmpeg", [
    "-rtsp_transport",
    "tcp",
    "-i",
    myVideoStreamerInstance.rtspUrl,
    "-g",
    "10",
    "-bufsize",
    "50k",
    "-preset",
    "ultrafast",
    "-tune",
    "zerolatency",
    "-c:v",
    "libx264",
    "-c:a",
    "aac",
    "-f",
    "mp4",
    "-movflags",
    "frag_keyframe+empty_moov+default_base_moof",
    "-min_frag_duration",
    "10",
    "pipe:1",
]);
ffmpeg.stdout.on("data", (chunk) => {
    // outputFile.write(chunk);
    //This is where the parsing and calculating of the length of each box will take place.
    (0, parse_stream_info_function_1.parse_video_chunk_info)(myVideoStreamerInstance, chunk);
    //This is where the data will be sliced, grouped into their respective segments and sent to the connected clients.
    if (myVideoStreamerInstance.processing_counter_queue.length > 0) {
        let jobs_removal_counter = 0;
        myVideoStreamerInstance
            .processing_counter_queue
            .forEach((job_info) => {
            jobs_removal_counter = (0, prep_fytp_moov_1.prep_fytp_moov)(myVideoStreamerInstance, job_info, jobs_removal_counter);
            jobs_removal_counter = (0, prep_moof_mdat_1.prep_moof_mdat)(myVideoStreamerInstance, job_info, jobs_removal_counter);
            let processing_counter_queue = myVideoStreamerInstance.processing_counter_queue;
            processing_counter_queue =
                processing_counter_queue.slice(jobs_removal_counter);
            myVideoStreamerInstance.processing_counter_queue = processing_counter_queue;
        });
    }
});
ffmpeg.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
});
ffmpeg.on("close", (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
});
