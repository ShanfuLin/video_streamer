"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
class videoStreamer_Instance {
    constructor(user_rtspURL, user_portNumber) {
        this.buf_chunks_string_holder_array = [];
        this.initialization_segment_ready_flag = false;
        this.initialization_segment_to_send = [];
        this.buffered_media_segment_ready_flag = false;
        this.buffered_media_segment_to_send = [];
        this.segment_end_index = {
            box_type: "nil",
            end_index: 0,
        };
        this.next_segment_counter = 0;
        this.processing_counter_queue = [];
        this.moof_counter = 0;
        this.mdat_counter = 0;
        this.checker = "";
        this.codec_info = "";
        this.rtspUrl = user_rtspURL;
        this.wss = new ws_1.default.Server({ port: user_portNumber });
    }
    get_rtspUrl() {
        return this.rtspUrl;
    }
    get_wss() {
        return this.wss;
    }
    get_buf_chunks_string_holder_array() {
        return this.buf_chunks_string_holder_array;
    }
    get_initialization_segment_ready_flag() {
        return this.initialization_segment_ready_flag;
    }
    get_initialization_segment_to_send() {
        return this.initialization_segment_to_send;
    }
    get_buffered_media_segment_ready_flag() {
        return this.buffered_media_segment_ready_flag;
    }
    get_buffered_media_segment_to_send() {
        return this.buffered_media_segment_to_send;
    }
    get_segment_end_index() {
        return this.segment_end_index;
    }
    get_next_segment_counter() {
        return this.next_segment_counter;
    }
    get_processing_counter_queue() {
        return this.processing_counter_queue;
    }
    get_moof_counter() {
        return this.moof_counter;
    }
    get_mdat_counter() {
        return this.mdat_counter;
    }
    get_checker() {
        return this.checker;
    }
    get_codec_info() {
        return this.codec_info;
    }
}
exports.default = videoStreamer_Instance;
