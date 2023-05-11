import WebSocket from "ws";

export default class videoStreamer_Instance {
  private _rtspUrl: string;
  //   outputFile: fs.WriteStream;
  private _wss: WebSocket.Server;

  private _buf_chunks_string_holder_array: number[] = [];
  private _initialization_segment_ready_flag: boolean = false;
  private _initialization_segment_to_send: number[] = [];
  private _buffered_media_segment_ready_flag: boolean = false;
  private _buffered_media_segment_to_send: number[] = [];
  private _segment_end_index: { box_type: string; end_index: number } = {
    box_type: "nil",
    end_index: 0,
  };
  private _next_segment_counter: number = 0;
  private _processing_counter_queue: {
    box_type: string;
    end_index: number;
  }[] = [];
  private _checker: string = "";

  public constructor(user_rtspURL: string, user_portNumber: number) {
    this._rtspUrl = user_rtspURL;
    this._wss = new WebSocket.Server({ port: user_portNumber });
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

  set buf_chunks_string_holder_array(input_buf_chunks_string_holder_array: number[]) {
    this._buf_chunks_string_holder_array = input_buf_chunks_string_holder_array;
  }

  get initialization_segment_ready_flag() {
    return this._initialization_segment_ready_flag;
  }

  set initialization_segment_ready_flag(input_ready_flag: boolean) {
    this._initialization_segment_ready_flag = input_ready_flag;
  }

  get initialization_segment_to_send() {
    return this._initialization_segment_to_send;
  }

  set initialization_segment_to_send(input_initialization_segment_to_send: number[]) {
    this._initialization_segment_to_send = input_initialization_segment_to_send;
  }

  get buffered_media_segment_ready_flag() {
    return this._buffered_media_segment_ready_flag;
  }

  set buffered_media_segment_ready_flag(input_ready_flag: boolean) {
    this._buffered_media_segment_ready_flag = input_ready_flag;
  }

  get buffered_media_segment_to_send() {
    return this._buffered_media_segment_to_send;
  }

  set buffered_media_segment_to_send(input_buffered_media_segment_to_send: number[]) {
    this._buffered_media_segment_to_send = input_buffered_media_segment_to_send;
  }

  get segment_end_index() {
    return this._segment_end_index;
  }

  set segment_end_index(input_segment_end_index: { box_type: string; end_index: number }) {
    this._segment_end_index = input_segment_end_index;
  }

  get next_segment_counter() {
    return this._next_segment_counter;
  }

  set next_segment_counter(input_next_segment_counter: number) {
    this._next_segment_counter = input_next_segment_counter;
  }

  get processing_counter_queue() {
    return this._processing_counter_queue;
  }

  set processing_counter_queue(input_processing_counter_queue: {
    box_type: string;
    end_index: number;
  }[]) {
    this._processing_counter_queue = input_processing_counter_queue;
  }

  get checker() {
    return this._checker;
  }

  set checker(input_checker: string) {
    this._checker = input_checker;
  }

}
