import videoStreamer_Instance from "./video_streamer_class";
import fs from "fs";

function prep_ftyp_moov(
  my_videoStreamer_Instance: videoStreamer_Instance,
  job_info: {
    box_type: string;
    end_index: number;
  },
  jobs_removal_counter: number, writeStream: fs.WriteStream
) {
  let buf_chunks_string_holder_array: number[] =
    my_videoStreamer_Instance.buf_chunks_string_holder_array;
  let initialization_segment_to_send: number[] =
    my_videoStreamer_Instance.initialization_segment_to_send;
  let initialization_segment_ready_flag: boolean =
    my_videoStreamer_Instance.buffered_media_segment_ready_flag;

  if (
    job_info.box_type == "ftyp&moov" &&
    buf_chunks_string_holder_array.length >= job_info.end_index
  ) {

    writeStream.write("\r\nStart of prep_fytp&moov: \r\n");
    writeStream.write(Date.now().toString());
    initialization_segment_to_send = buf_chunks_string_holder_array.slice(
      0,
      job_info.end_index
    );
    initialization_segment_ready_flag = true;
    buf_chunks_string_holder_array = buf_chunks_string_holder_array.slice(
      job_info.end_index
    );
    jobs_removal_counter = jobs_removal_counter + 1;
    writeStream.write("\r\nEnd of prep_fytp&moov: \r\n");
    writeStream.write(Date.now().toString());
  }
  my_videoStreamer_Instance.buf_chunks_string_holder_array = buf_chunks_string_holder_array;
  my_videoStreamer_Instance.initialization_segment_to_send = initialization_segment_to_send;
  my_videoStreamer_Instance.initialization_segment_ready_flag = initialization_segment_ready_flag;
  return jobs_removal_counter;
}

export { prep_ftyp_moov };
