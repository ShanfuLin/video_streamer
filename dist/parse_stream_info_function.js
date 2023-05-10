"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse_video_chunk_info = void 0;
const decToHex = (dec) => {
    return dec.toString(16).padStart(2, "0").toUpperCase();
};
const hexToDec = (hex) => {
    return parseInt(hex, 16);
};
function parse_video_chunk_info(my_videoStreamer_Instance, chunk) {
    let buf_chunks_string_holder_array = my_videoStreamer_Instance.get_buf_chunks_string_holder_array();
    let segment_end_index = my_videoStreamer_Instance.get_segment_end_index();
    let next_segment_counter = my_videoStreamer_Instance.get_next_segment_counter();
    let processing_counter_queue = my_videoStreamer_Instance.get_processing_counter_queue();
    let moof_counter = my_videoStreamer_Instance.get_moof_counter();
    let mdat_counter = my_videoStreamer_Instance.get_mdat_counter();
    let checker = my_videoStreamer_Instance.get_checker();
    for (var i = 0; i < chunk.length; i++) {
        buf_chunks_string_holder_array.push(chunk[i]);
        checker += decToHex(chunk[i]);
        if (checker.length == 16) {
            if (checker.slice(-8) === "66747970") {
                let box_size_string = checker.slice(-16, -8);
                let num_bytes = hexToDec(box_size_string);
                next_segment_counter += num_bytes;
            }
            else if (checker.slice(-8) === "6D6F6F76") {
                let box_size_string = checker.slice(-16, -8);
                let num_bytes = hexToDec(box_size_string);
                next_segment_counter += num_bytes;
                segment_end_index = {
                    box_type: "ftyp&moov",
                    end_index: next_segment_counter,
                };
                processing_counter_queue.push(segment_end_index);
                next_segment_counter = 0;
            }
            else if (checker.slice(-8) === "6D6F6F66") {
                let box_size_string = checker.slice(-16, -8);
                let num_bytes = hexToDec(box_size_string);
                next_segment_counter += num_bytes;
                moof_counter++;
            }
            else if (checker.slice(-8) === "6D646174") {
                let box_size_string = checker.slice(-16, -8);
                let num_bytes = hexToDec(box_size_string);
                next_segment_counter += num_bytes;
                segment_end_index = {
                    box_type: "moof&mdat",
                    end_index: next_segment_counter,
                };
                processing_counter_queue.push(segment_end_index);
                next_segment_counter = 0;
                mdat_counter++;
            }
            checker = checker.slice(2);
        }
    }
}
exports.parse_video_chunk_info = parse_video_chunk_info;
