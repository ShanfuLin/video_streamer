"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
class videoStreamer_Instance {
    constructor(user_rtspURL, user_portNumber) {
        this._buf_chunks_string_holder_array = [];
        this._initialization_segment_ready_flag = false;
        this._initialization_segment_to_send = [];
        this._buffered_media_segment_ready_flag = false;
        this._buffered_media_segment_to_send = [];
        this._segment_end_index = {
            box_type: "nil",
            end_index: 0,
        };
        this._next_segment_counter = 0;
        this._processing_counter_queue = [];
        this._checker = "";
        this._rtspUrl = user_rtspURL;
        this._wss = new ws_1.default.Server({ port: user_portNumber });
    }
    get rtspUrl() {
        return this._rtspUrl;
    }
    get wss() {
        return this._wss;
    }
    get buf_chunks_string_holder_array() {
        return this._buf_chunks_string_holder_array;
    }
    set buf_chunks_string_holder_array(input_buf_chunks_string_holder_array) {
        this._buf_chunks_string_holder_array = input_buf_chunks_string_holder_array;
    }
    get initialization_segment_ready_flag() {
        return this._initialization_segment_ready_flag;
    }
    set initialization_segment_ready_flag(input_ready_flag) {
        this._initialization_segment_ready_flag = input_ready_flag;
    }
    get initialization_segment_to_send() {
        return this._initialization_segment_to_send;
    }
    set initialization_segment_to_send(input_initialization_segment_to_send) {
        this._initialization_segment_to_send = input_initialization_segment_to_send;
    }
    get buffered_media_segment_ready_flag() {
        return this._buffered_media_segment_ready_flag;
    }
    set buffered_media_segment_ready_flag(input_ready_flag) {
        this._buffered_media_segment_ready_flag = input_ready_flag;
    }
    get buffered_media_segment_to_send() {
        return this._buffered_media_segment_to_send;
    }
    set buffered_media_segment_to_send(input_buffered_media_segment_to_send) {
        this._buffered_media_segment_to_send = input_buffered_media_segment_to_send;
    }
    get segment_end_index() {
        return this._segment_end_index;
    }
    set segment_end_index(input_segment_end_index) {
        this._segment_end_index = input_segment_end_index;
    }
    get next_segment_counter() {
        return this._next_segment_counter;
    }
    set next_segment_counter(input_next_segment_counter) {
        this._next_segment_counter = input_next_segment_counter;
    }
    get processing_counter_queue() {
        return this._processing_counter_queue;
    }
    set processing_counter_queue(input_processing_counter_queue) {
        this._processing_counter_queue = input_processing_counter_queue;
    }
    get checker() {
        return this._checker;
    }
    set checker(input_checker) {
        this._checker = input_checker;
    }
}
exports.default = videoStreamer_Instance;
