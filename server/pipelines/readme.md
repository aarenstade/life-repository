# Pipelines

There are some different pipelines we want to run all the files through.
- File deduplication
- File metadata extraction
- Voice detection and transcription
- Image and video auto-annotation.

Let's go through each in a little more depth.

## File Deduplication
When centralizing all the files in my life, inevitably there's going to be duplicates. These files will likely be different directories, have different file names, and the raw data may even vary slightly from one another.

For example an original image vs. a cropped/compressed/screenshotted version of that image.

In order to hunt down these duplicate files, I'll use the method of [Locality Sensitive Hashing](https://en.wikipedia.org/wiki/Locality-sensitive_hashing) (LSH).

This will hopefully bucket duplicate files together that either exact matches or are *mostly* similar.

## File Metadata Extraction
This is the simple step of extracting all of the metadata I possibly can from each file. For example, date time information, file types, file sizes, video codecs, audio bit rates, and so on and so forth.

Additionally, images taken on my iPhone typically have coordinates (which will be very useful), and information about the camera settings such as aperature, focal length, etc.

## Voice Detection & Transcription
A good amount of the videos could have talking in them. I could just transcribe all of the audio from the video files, but that would be inefficient and expensive. 

So each audio file (extracted from video) will be subdivided into segments, and I will detect whether voice information exists in that segment or not.

Then the files that have voice activity will be transcribed.

## Image & Video Auto-Annotation
With the advancement of multimodal models (particularly GPT-4o as of writing this), a rich corpus of information can be extracted from each image and video.

The input prompt will ask the model to label the image following all the different tagging types defined in [annotation-types.md](annotation-types.md).

The output of that will be run once again through a cheaper model (GPT-3.5) to restructure it into structured JSON data.

As the models aren't advanced enough to deal with video (yet), I have a method of extracting unique frames from video. Then each of those unique frames will run through the same process, with a final step of merging the annotations together into one piece of structured data.