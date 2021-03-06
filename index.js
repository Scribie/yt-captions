// Generated by CoffeeScript 1.9.1
var fs, insert, request;

fs = require('fs');

request = require('request');

insert = function(auth_token, video_id, caption_name, caption_file, caption_language, callback) {
  var body, options;
  if (!auth_token) {
    return callback(new Error('Invalid auth_token'));
  }
  if (!video_id) {
    return callback(new Error('Invalid video_id'));
  }
  if (!caption_name) {
    return callback(new Error('Invalid caption_name'));
  }
  if (!caption_file) {
    return callback(new Error('Invalid caption_file'));
  }
  if (!caption_language) {
    return callback(new Error('Invalid caption_language'));
  }
  if (!fs.existsSync(caption_file)) {
    return callback(new Error('Caption file not found'));
  }
  body = {
    snippet: {
      videoId: video_id,
      name: caption_name,
      language: caption_language
    }
  };
  options = {
    method: 'POST',
    url: 'https://www.googleapis.com/upload/youtube/v3/captions',
    qs: {
      part: 'snippet',
      uploadType: 'multipart',
      alt: 'json'
    },
    headers: {
      'Authorization': "Bearer " + auth_token,
      'Content-Length': fs.statSync(caption_file).size
    },
    multipart: {
      chunked: true,
      data: [
        {
          'Content-Type': 'application/json',
          body: JSON.stringify(body)
        }, {
          'Content-Type': 'text/plain',
          body: fs.createReadStream(caption_file, 'utf8')
        }
      ]
    },
    json: true
  };
  return request(options, function(error, response, body) {
    if (error != null) {
      return callback(error);
    }
    if (response.statusCode !== 200) {
      return callback(new Error(body.error.message), body.error);
    }
    return callback();
  });
};

module.exports = {
  insert: insert
};
