import WebSocket from "ws";

export default class videoStreamer_Instance {
  private rtspUrl: string;
  //   outputFile: fs.WriteStream;
  private wss: WebSocket.Server;

  private buf_chunks_string_holder_array: number[] = [];
  private initialization_segment_ready_flag: boolean = false;
  private initialization_segment_to_send: number[] = [];
  private buffered_media_segment_ready_flag: boolean = false;
  private buffered_media_segment_to_send: number[] = [];
  private segment_end_index: { box_type: string; end_index: number } = {
    box_type: "nil",
    end_index: 0,
  };
  private next_segment_counter: number = 0;
  private processing_counter_queue: {
    box_type: string;
    end_index: number;
  }[] = [];
  private moof_counter: number = 0;
  private mdat_counter: number = 0;
  private checker: string = "";
  private codec_info: string = "";

  public constructor(user_rtspURL: string, user_portNumber: number) {
    this.rtspUrl = user_rtspURL;
    this.wss = new WebSocket.Server({ port: user_portNumber });
  }

  public get_rtspUrl() {
    return this.rtspUrl;
  }

  public get_wss() {
    return this.wss;
  }

  public get_buf_chunks_string_holder_array() {
    return this.buf_chunks_string_holder_array;
  }

  public get_initialization_segment_ready_flag() {
    return this.initialization_segment_ready_flag;
  }

  public get_initialization_segment_to_send() {
    return this.initialization_segment_to_send;
  }

  public get_buffered_media_segment_ready_flag() {
    return this.buffered_media_segment_ready_flag;
  }

  public get_buffered_media_segment_to_send() {
    return this.buffered_media_segment_to_send;
  }

  public get_segment_end_index() {
    return this.segment_end_index;
  }

  public get_next_segment_counter() {
    return this.next_segment_counter;
  }

  public get_processing_counter_queue() {
    return this.processing_counter_queue;
  }

  public get_moof_counter() {
    return this.moof_counter;
  }

  public get_mdat_counter() {
    return this.mdat_counter;
  }

  public get_checker() {
    return this.checker;
  }

  public get_codec_info() {
    return this.codec_info;
  }
}
