

var fs = require('fs');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var omdb = require('omdb');
var request = require('request');
var input1 = process.argv[2];
var input2 = process.argv.splice(3).join(" ");
var inquirer = require('inquirer');
var spotify = new Spotify({
  id: "cef63e24143248a1b9f46a97ba86f361",
  secret: '3c52cb8e230d4f578d81c99540740e42'
});

function log() {

    fs.appendFile('./log.txt', input1 + " " + input2 + ", ", function(err) {

        // log if issues. 
        if (err) {
            console.log(err);
        }

        // log if no error. 
        else {
            console.log("Updated!");
        }

    });
};

var keys = require('./keys.js');
// console.log(keys.twitterKeys);

var client = new Twitter(keys.twitterKeys);

var params = {
    screen_name: 'KeissyHw',
    count: 20
};

run();

function run() {

    if (input1 === "my-tweets") {
// pulls the data from my tweeter account. 
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
                // console logs the last 5
                console.log('');
                console.log('My Last 20 Tweets: ');
                console.log('--------------------------');
                tweets.forEach(function(individualTweet) {
                    console.log('Date & Time: ' + individualTweet.created_at);
                    console.log(individualTweet.text);
                    console.log('--------------------------');


                });

            } else {
                console.log(error);
            };
        });//end of tweets

        log();

    } else if (input1 === "spotify-this-song") {

        if (input2.length < 1) {

            input2 = "The Sing by Ace of Base";
        };

        spotify.search({type: 'track', query: input2 }, function(err, data) {
            if (err) {
                console.log('Its possible this song doesnt exist.');
                return;
            }
            console.log('');
            console.log('Spotify Song Information Results: ');
            console.log('--------------------------');
            console.log("Artist: " + data.tracks.items[0].artists[0].name); 
            console.log("Song name: " + data.tracks.items[0].name);
            console.log("Spotify Link: " + data.tracks.items[0].external_urls.spotify);    
            console.log("Album Title: " + data.tracks.items[0].album.name);
            console.log('--------------------------');

        });// end of spotify 


        log();

    } else if (input1 === "movie-this") {

        if (input2.length < 1) {

            input2 = "Mr. Nobody";
        };

        // Then run a request to the OMDB API with the movie specified
        request("http://www.omdbapi.com/?t=" + input2 + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

            // If the request is successful (i.e. if the response status code is 200)
            if (!error && response.statusCode === 200) {

                // logs the movie information for the one selected. 
                console.log('');
                console.log('OMDB Movie Information: ');
                console.log('--------------------------');
                console.log("Movie Title: " + JSON.parse(body).Title);
                console.log("Released: " + JSON.parse(body).Released);
                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                console.log("Countries produced in: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Movie Plot: " + JSON.parse(body).Plot);
                console.log("Actor(s): " + JSON.parse(body).Actors);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("Rotten Tomatoes URL: " + JSON.parse(body).Ratings[2].Value);
                console.log('--------------------------');
            } else {

                console.log("This broke ma dude");

            }

        }); // end of imdb 

        log();

// Read the text thats in the ramdon file. 
    } else if (input1 === "do-what-it-says") {

        log();

        fs.readFile('random.txt', 'utf8', function(err, data) {
            if (err) throw err;
            console.log(data);

            var arr = data.split(',');

            // input1 = arr[0].trim();
            // input2 = arr[1].trim();
            // run();

        });

    }
};