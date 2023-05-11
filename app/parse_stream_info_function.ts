import videoStreamer_Instance from "./video_streamer_class";

const decToHex = (dec: number): string => {
  return dec.toString(16).padStart(2, "0").toUpperCase();
};

const hexToDec = (hex: string): number => {
  return parseInt(hex, 16);
};

function parse_video_chunk_info(
  my_videoStreamer_Instance: videoStreamer_Instance,
  chunk: Buffer
) {

  let buf_chunks_string_holder_array: number[] =
    my_videoStreamer_Instance.buf_chunks_string_holder_array;

  let segment_end_index: { box_type: string; end_index: number } =
    my_videoStreamer_Instance.segment_end_index;

  let next_segment_counter: number =
    my_videoStreamer_Instance.next_segment_counter;

  let processing_counter_queue: {
    box_type: string;
    end_index: number;
  }[] = my_videoStreamer_Instance.processing_counter_queue;

  let checker: string = my_videoStreamer_Instance.checker;

  for (var i = 0; i < chunk.length; i++) {
    buf_chunks_string_holder_array.push(chunk[i]);
    checker += decToHex(chunk[i]);
    if (checker.length == 16) {
      if (checker.slice(-8) === "66747970") {
        let box_size_string = checker.slice(-16, -8);
        let num_bytes = hexToDec(box_size_string);
        next_segment_counter += num_bytes;
      } else if (checker.slice(-8) === "6D6F6F76") {
        let box_size_string = checker.slice(-16, -8);
        let num_bytes = hexToDec(box_size_string);
        next_segment_counter += num_bytes;
        segment_end_index = {
          box_type: "ftyp&moov",
          end_index: next_segment_counter,
        };
        processing_counter_queue.push(segment_end_index);
        next_segment_counter = 0;
      } else if (checker.slice(-8) === "6D6F6F66") {
        let box_size_string = checker.slice(-16, -8);
        let num_bytes = hexToDec(box_size_string);
        next_segment_counter += num_bytes;
      } else if (checker.slice(-8) === "6D646174") {
        let box_size_string = checker.slice(-16, -8);
        let num_bytes = hexToDec(box_size_string);
        next_segment_counter += num_bytes;
        segment_end_index = {
          box_type: "moof&mdat",
          end_index: next_segment_counter,
        };
        processing_counter_queue.push(segment_end_index);
        next_segment_counter = 0;
      }
      checker = checker.slice(2);
    }
  }
  my_videoStreamer_Instance.buf_chunks_string_holder_array = buf_chunks_string_holder_array;
  my_videoStreamer_Instance.processing_counter_queue = processing_counter_queue;
  my_videoStreamer_Instance.checker = checker;
}

export { parse_video_chunk_info };
