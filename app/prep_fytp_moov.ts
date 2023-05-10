import videoStreamer_Instance from "./video_streamer_class";

function prep_fytp_moov(
  my_videoStreamer_Instance: videoStreamer_Instance,
  job_info: {
    box_type: string;
    end_index: number;
  },
  jobs_removal_counter: number
) {
  let buf_chunks_string_holder_array: number[] =
    my_videoStreamer_Instance.get_buf_chunks_string_holder_array();
  let initialization_segment_to_send: number[] =
    my_videoStreamer_Instance.get_initialization_segment_to_send();
  let initialization_segment_ready_flag: boolean =
    my_videoStreamer_Instance.get_buffered_media_segment_ready_flag();

  if (
    job_info.box_type == "ftyp&moov" &&
    buf_chunks_string_holder_array.length >= job_info.end_index
  ) {
    initialization_segment_to_send = buf_chunks_string_holder_array.slice(
      0,
      job_info.end_index
    );
    initialization_segment_ready_flag = true;
    buf_chunks_string_holder_array = buf_chunks_string_holder_array.slice(
      job_info.end_index
    );
    jobs_removal_counter = jobs_removal_counter + 1;
  }
  console.log(jobs_removal_counter);
  return jobs_removal_counter;
}

export { prep_fytp_moov };
