"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prep_fytp_moov = void 0;
function prep_fytp_moov(my_videoStreamer_Instance, job_info, jobs_removal_counter) {
    let buf_chunks_string_holder_array = my_videoStreamer_Instance.get_buf_chunks_string_holder_array();
    let initialization_segment_to_send = my_videoStreamer_Instance.get_initialization_segment_to_send();
    let initialization_segment_ready_flag = my_videoStreamer_Instance.get_buffered_media_segment_ready_flag();
    if (job_info.box_type == "ftyp&moov" &&
        buf_chunks_string_holder_array.length >= job_info.end_index) {
        initialization_segment_to_send = buf_chunks_string_holder_array.slice(0, job_info.end_index);
        initialization_segment_ready_flag = true;
        buf_chunks_string_holder_array = buf_chunks_string_holder_array.slice(job_info.end_index);
        jobs_removal_counter = jobs_removal_counter + 1;
    }
    console.log(jobs_removal_counter);
    return jobs_removal_counter;
}
exports.prep_fytp_moov = prep_fytp_moov;
