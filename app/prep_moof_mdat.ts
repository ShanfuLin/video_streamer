import videoStreamer_Instance from "./video_streamer_class";
import WebSocket from "ws";

function prep_moof_mdat(
  my_videoStreamer_Instance: videoStreamer_Instance,
  job_info: {
    box_type: string;
    end_index: number;
  },
  jobs_removal_counter: number
) {
  let buf_chunks_string_holder_array: number[] =
    my_videoStreamer_Instance.buf_chunks_string_holder_array;

  let buffered_media_segment_to_send: number[] =
    my_videoStreamer_Instance.buffered_media_segment_to_send;

  let buffered_media_segment_ready_flag: boolean =
    my_videoStreamer_Instance.buffered_media_segment_ready_flag;

  let wss: WebSocket.Server = my_videoStreamer_Instance.wss;

  let processing_counter_queue: {
    box_type: string;
    end_index: number;
  }[] = my_videoStreamer_Instance.processing_counter_queue;
  if (
    job_info.box_type == "moof&mdat" &&
    buf_chunks_string_holder_array.length >= job_info.end_index
  ) {
    buffered_media_segment_to_send = buf_chunks_string_holder_array.slice(
      0,
      job_info.end_index
    );
    buffered_media_segment_ready_flag = true;
    buf_chunks_string_holder_array = buf_chunks_string_holder_array.slice(
      job_info.end_index
    );
    if (
      buf_chunks_string_holder_array.length != 0 ||
      (buf_chunks_string_holder_array[4] != 102 &&
        buf_chunks_string_holder_array[5] != 116 &&
        buf_chunks_string_holder_array[6] != 121 &&
        buf_chunks_string_holder_array[7] != 112) ||
      (buf_chunks_string_holder_array[4] != 109 &&
        buf_chunks_string_holder_array[5] != 100 &&
        buf_chunks_string_holder_array[6] != 97 &&
        buf_chunks_string_holder_array[7] != 116)
    ) {
      buf_chunks_string_holder_array = [];
      processing_counter_queue = [];
    }
    jobs_removal_counter = jobs_removal_counter + 1;

    if (wss.clients.size >= 1) {
      wss.clients.forEach((client) => {
        client.send(new Uint8Array(buffered_media_segment_to_send).buffer);
      });
    }
  }
  my_videoStreamer_Instance.buf_chunks_string_holder_array = buf_chunks_string_holder_array;
  my_videoStreamer_Instance.buffered_media_segment_to_send = buffered_media_segment_to_send;
  my_videoStreamer_Instance.buffered_media_segment_ready_flag = buffered_media_segment_ready_flag;
  my_videoStreamer_Instance.processing_counter_queue = processing_counter_queue;
  return jobs_removal_counter;
}

export { prep_moof_mdat };
