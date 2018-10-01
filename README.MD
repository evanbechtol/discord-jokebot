## Discord JokeBot

#### Description:
The Jokebot can be used by users within the guild to direct jokes/insults at other users in the guild. Some are light-hearted and some are darker, but all are meant as a joke.

- - - 
#### Installation: 
Once the code has been downloaded, simply run ```npm install``` to install all required dependencies. Then, you can simply start the application using ```node index.js```!
* Add to your discord: [JokeBot](https://discordapp.com/oauth2/authorize?&client_id=256076486174310401&scope=bot)

- - -
#### Commands available:
* **help**: 
   * Self-explanatory, prints a help message.
* **joke**: 
   * Requires you to mention another user! 
   * Returns a joke, directed at the user mentioned. *(Please note that some jokes may be NSFW, however the file containing jokes can be edited freely, or you can make your own altogether!)*
* Usage: ```!jokebot <command> <optional mention of user>```
- - -        
#### Operation:

* The JokeBot will also call out users who are typing in the channel with a very low probability of 0.003%. This also includes the option to increase the probability of occurrence for specific users, if desired.
* There is a logging feature that keeps track of when the bot connects to guilds, and which guilds it connects to. It also tracks usage of the bot, showing which users are sending and receiving jokes.
* Trying to make the bot direct a joke at itself will make the bot instead direct a witty remark at the user attempting.
* Jokes/Typing response/Rebuttal files can be easily modified to suit the needs of the guilds.

- - -
#### Future Features:
* Addition of "register", "delete", and "update" commands to modify the files from the discordapp.
* Incorporation of a database that can welcome 1st time users to the guild, and welcome back returning members in a light-hearted manner.
    
- - -
#### Code Notes: 
I have kept most of the code very modularized, so that new features can be added or removed, without impacting the other features of the application.
