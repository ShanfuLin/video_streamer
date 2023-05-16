import WebSocket from "ws";
import { spawn } from "child_process";
import fs from "fs";
import videoStreamer_Instance from "./video_streamer_class";
import { parse_video_chunk_info } from "./parse_stream_info_function";
import { prep_ftyp_moov } from "./prep_ftyp_moov";
import { prep_moof_mdat } from "./prep_moof_mdat";

//"rtsp://justinn.lc4i.club:8554/ivh-pudo-2"
// "rtsp://192.168.50.187:8080/h264_ulaw.sdp"
const myVideoStreamerInstance = new videoStreamer_Instance(
    "rtsp://wenyen.lc4i.club:8554/meeting",
    4001
);
// const outputFile: fs.WriteStream = fs.createWriteStream("ffmpeg_output.bin");
const wss: WebSocket.Server = myVideoStreamerInstance.wss;

wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected");
    if (myVideoStreamerInstance.initialization_segment_ready_flag) {
        wss.clients.forEach((client: WebSocket) => {
            client.send(
                new Uint8Array(
                    myVideoStreamerInstance.initialization_segment_to_send
                ).buffer
            );
            console.log("Sent initialization segment to clients");
        });
    }
    if (myVideoStreamerInstance.buffered_media_segment_ready_flag) {
        wss.clients.forEach((client: WebSocket) => {
            client.send(
                new Uint8Array(
                    myVideoStreamerInstance.buffered_media_segment_to_send
                ).buffer
            );
        });
    }

    ws.on("close", () => {
        console.log("Client disconnected");
    });

    ws.on("error", (error: Error) => {
        console.error("WebSocket error:", error);
    });
});

const ffmpeg = spawn("ffmpeg", [
    "-rtsp_transport",
    "tcp",
    "-i",
    myVideoStreamerInstance.rtspUrl,
    "-g",
    "2",
    "-preset",
    "ultrafast",
    "-tune",
    "zerolatency",
    "-c:v",
    // "copy",
    "libx264",
    "-c:a",
    "aac",
    "-f",
    "mp4",
    "-movflags",
    "frag_keyframe+empty_moov+default_base_moof",
    "-min_frag_duration",
    "1000",
    "pipe:1",
]);

// const ffmpeg = spawn("ffmpeg", [
//     "-rtsp_transport",
//     "tcp",
//     "-fflags",
//     "nobuffer",
//     "-probesize",
//     "32",
//     "-analyzeduration",
//     "0",
//     "-i",
//     myVideoStreamerInstance.rtspUrl,
//     "-c:v",
//     "copy",
//     "-g",
//     "2",
//     "-c:a",
//     "aac",
//     "-channel_layout",
//     "stereo",
//     "-movflags",
//     "frag_keyframe+empty_moov+default_base_moof",
//     "-frag_duration",
//     "1000",
//     "-tune",
//     "zerolatency",
//     "-crf",
//     "18",
//     "-f",
//     "mp4",
//     "-",
// ]);

const path: string = "./execution_time_log.txt";
let writeStream: fs.WriteStream;
writeStream = fs.createWriteStream(path, { flags: 'a' });

ffmpeg.stdout.on("data", (chunk: Buffer) => {
    // outputFile.write(chunk);

    writeStream.write("\r\nStart of parse_video_chunk_info: \r\n");
    writeStream.write(Date.now().toString());
    //This is where the parsing and calculating of the length of each box will take place.
    parse_video_chunk_info(myVideoStreamerInstance, chunk);
    writeStream.write("\r\nEnd of parse_video_chunk_info: \r\n");
    writeStream.write(Date.now().toString());

    //This is where the data will be sliced, grouped into their respective segments and sent to the connected clients.
    writeStream.write("\r\nStart of slicing of data to prepare for sending: \r\n");
    writeStream.write(Date.now().toString());
    if (myVideoStreamerInstance.processing_counter_queue.length > 0) {
        let jobs_removal_counter = 0;
        myVideoStreamerInstance
            .processing_counter_queue
            .forEach((job_info) => {

                jobs_removal_counter = prep_ftyp_moov(myVideoStreamerInstance, job_info, jobs_removal_counter, writeStream);

                jobs_removal_counter = prep_moof_mdat(myVideoStreamerInstance, job_info, jobs_removal_counter, writeStream);

                let processing_counter_queue =
                    myVideoStreamerInstance.processing_counter_queue;

                writeStream.write("\r\nStart processing counter queue: \r\n");
                writeStream.write(Date.now().toString());
                processing_counter_queue =
                    processing_counter_queue.slice(jobs_removal_counter);
                writeStream.write("\r\nEnd processing counter queue: \r\n");
                writeStream.write(Date.now().toString());

                myVideoStreamerInstance.processing_counter_queue = processing_counter_queue;
            });
    }
    writeStream.write("\r\nEnd of slicing of data to prepare for sending: \r\n");
    writeStream.write(Date.now().toString());
});

ffmpeg.stderr.on("data", (data: Buffer) => {
    console.log(`stderr: ${data}`);
});

ffmpeg.on("close", (code: number) => {
    console.log(`FFmpeg process exited with code ${code}`);
});
