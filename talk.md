[Logo Slide]

This is a day I’ve been looking forward to for two-and-a-half weeks.

Every once in a while, a revolutionary product comes along that changes everything. And ThoughtWorks has been – well, first of all, one’s very fortunate if you get to work on just one of these in your career.

[Blank]

ThoughtWorks's been very fortunate. It’s been able to introduce a few of these into the world.

[2001]

In 2001, we introduced the CruiseControl.

[2001, CruiseControl]

It didn’t just change ThoughtWorks, it changed the whole software industry.

In 2004, we introduced the Selenium,

[2004, Selenium]

and… it didn’t just – it didn’t just change the way we all wrote tests, it changed the entire software industry (again).

You see what I did there?

[Logo Slide]

Well, today, we’re introducing three revolutionary products of this class.

The first one: is a powerful way of thinking about the path to production. [0:27:59]
The second: is a revolutionary continuous integration system. [0:28:13]
And the third is a breakthrough community oriented package sharing.[0:28:28]

***So, three things: a widescreen iPod with touch controls; a revolutionary mobile phone; and a breakthrough Internet communications device. [0:28:44]
An iPod, a phone, and an Internet communicator. An iPod, a phone … are you getting it? [0:29:01]
These are not three separate devices, this is one device, and we are calling it iPhone. [0:29:19]
Today, today ThoughtWorks is going to reinvent CI, and here it is. [0:29:30]
No, actually here it is, but we’re gonna leave it there for now. [0:29:41]






So, before we get into it, let me uh talk about a category of things. The most advanced CI tools are called CD Pipelines. So they say. [0:29:57]
And uh they typically combine a phone plus some build-triggering capability, plus they say it’s has pipelines. It’s sort of that fanning and fanning out bit still very linear, into one device, and they these cumbersome nomenclature: tasks, stages, jobs, pipelines. It's domain driven design with a thesaurus for plumbers.

uh And the problem is that they’re not so powerful and they’re not so easy to use, so if you kinda make a… Business School 101 graph of the powerful axis and the easy-to-use axis, phones, regular cell phones are kinda right there, they’re not so powerful, and they’re – you know – not so easy to use. [0:30:28]
uhm But smart phones are definitely a little smarter, but they actually are harder to use. They’re really complicated. Just for the basic stuff a hard time figuring out how to use them. [0:30:41]
Well, we don’t wanna do either one of these things. What we wanna do is make a leapfrog product that is way more powerfully than any mobile device has ever been, and super-easy to use.
This is what GraphCI is. [0:30:57]




[0:30:59]
So, we’re gonna reinvent CI. [0:31:01]
Now, we’re gonna start… with a revolutionary user interface.. is the result of years of research and development, and of course, it's from years of dealing with shitty build systems.
Now, why do we need a revolutionary user interface? I mean, Here’s four CI systems, right? GoCD, Jenkins, Travis, TeamCity – the usual suspects. [0:31:33]
And, what’s wrong with their user interfaces? Well, the problem with them is really sort of in everything about them. It’s, it’s this stuff right here.

They have these ways of describe builds that seem unrelated to the process of building software.

- We have to learn an entire new language (thanks Kotlin)
- We have hand craft XML or JSON because we all enjoy that
- The domain of the tool bleeds into my description of the build process
- We type incredibly important information into ephemeral build servers with no hope of recovery.
- We type the same crap again and again for each and every pipeline
- Heaven forbid you get a build failure you can't replicate locally.
- And don't get us starting on whether your client will let you use a hosted setup or likes to see whether you have the chops to self-host.


Well, how do you solve this?
Hmm. It turns out, we have solved it! Again and again and again. [0:32:27]
We solved it in computers however many years ago. We solved it with a directed acyclical graphs that could express anything we want. Run any tasks in parallel or sequence. We solved it by using YAML. We solved it by having configuration as code. We solved it with virtualisation.

We, the industry, have solved these problem. Time and time again. So when are we going to stop rewriting the same old pipeline config.
What we gonna do is get rid of all these pipelines and just make a giant graph.
A giant graph. [0:32:54]

Then we're going to take parts of this graph and share it.
Other people are going to take these subgraphs and build great things.
Yeah, you're starting to get it.

We're gonna use the best/most pervasive container platform in the world. We're gonna use a container platform we're all sick of - we're gonna use docker. Docker means you can run this locally. You can run your entire graph or part of it. On your computer, at home.

Docker also means we don't need agents anymore. One less agent is one fewer thing to provision. If you have to provision it, you have to maintain it. I've seen your ansible.

While we're talking about provisioning, let's talk a little about how the world used to organise their build systems. Someone else can do it for you for a $25,000 a year and if you don't like they do it. You can always use the same overwrought system, self-hosted. Because the people charge 25K a year for hosted are going to write easy to deploy, maintain and host software. No conflict of interest there.

Let me show you a false dichotomy. [Graph of hosted -> self-hosted].
You can have hosted or, you can have self-hosted.
They want you think this way. It's easier for them.

Let me show you another false dichotomy. I'm not talking about the coke vs. pepsi bullshit.

[ graph of gender binary ]

They were wrong their too.

There are more options. We've got your covered with self-hosted as a service.



[something else]

[demo]







We’re gonna use the best pointing device in the world. We’re gonna use a pointing device that we’re all born with – we’re born with ten of them. We’re gonna use our fingers.
We’re gonna touch this with our fingers. And we have invented a new technology called multi-touch, which is phenomenal. [0:33:33]
It works like magic.
You don’t need a stylus. It’s far more accurate than any touch display that’s ever been shipped.
It ignores unintended touches, it’s super-smart.
You can do multi-finger gestures on it.
And boy, have we patented it. [0:33:54]

So, so we have been very lucky to have brought a few revolutionary user interfaces to the market in our time.
First was the mouse.
The second was the click wheel.
And now, we’re gonna bring multi-touch to the market. [0:34:20]
And each of these revolutionary user interfaces has made possible a revolutionary product – the Mac, the iPod and now the iPhone. [0:34:30]
So, a revolutionary user interface.
We’re gonna build on top of that with software. Now, software on mobile phones is like is like baby software.
It’s not so powerful, and today we gonna show you a software breakthrough. Software that’s at least five years ahead of what’s on any other phone. [0:34:55]
Now how do we do this? Well, we start with a strong foundation: iPhone runs OSX.
Now, why, why would we wanna run such a sophisticated operating system on a mobile device? Well, because it’s got everything we need.
It’s got multi-tasking.
It’s got the best networking.
It already knows how to power manage. We’ve been doing this on mobile computers for years. It’s got awesome security.
And the right apps.
It’s got everything from Cocoa and the graphics and it’s got core animation built in and it’s got the audio and video that OSX is famous for.
It’s got all the stuff we want. [0:35:43]
And it’s built right into iPhone. And that has let us create desktop class applications and networking, right. [0:35:52]
Not the crippled stuff that you find on most phones. This is real, desktop-class applications. [0:35:59]

Now, you know, one of the pioneers of our industry, Alan Kay, has had a lot of great quotes throughout the years. And I ran across one of them recently that explains how we look at this.
Explains why we go about doing things the way we do, cause we love software.[0:36:18]
And here’s the quote: “People who are really serious about software should make their own hardware.” [0:36:25]
You know, Alan said this 30 years ago, and this is how we feel about it.
And so we’re bringing breakthrough software to a mobile device for the first time.
It’s five years ahead of anything on any other phone.
The second thing we’re doing is we’re learning from the iPod, syncing with iTunes.
You know, we’re gonna ship our 100 millionth iPod this year, and that’s a lo… 10s of millions of people that know how to sync these devices with their PCs or Mac and sync all of their media right on to their iPod. [0:36:59]
Right?
So you just drop your iPod in, and it automatically syncs.
You’re gonna do the same thing with iPhone. It automatically syncs to your PC or Mac right through iTunes.
And iTunes is gonna sync all of your media onto your iPhone: Your music, your audio books, podcasts, movies, TV shows, music videos. [0:37:19]
But it also syncs a ton of data: Your contacts, your calendars and your photos, which you can get on your iPod today, your notes, your..your bookmarks from your Web browser, your e-mail accounts, your whole e-mail set-up. All that stuff can be moved over to your iPhone completely automatically.
It’s really nice.
And we do it, we do it through iTunes. [0:37:41]
Again, you go to iTunes and you set it up. Just like you’d set up an iPod or an Apple TV. And you set up what you want synced to your iPhone. And it’s just like an iPod. Charge and sync. So sync with iTunes.[0:37:55]

Third thing I wanna talk about a little is design. [0:38:00]
We’ve designed something wonderful for your hand, just wonderful.
And this is what it looks like.
It’s got a three-and-a-half-inch screen on it. It’s really big.
And, it’s the highest-resolution screen we’ve ever shipped. It’s 160 pixels per inch.
Highest we’ve ever shipped. It’s gorgeous.
And on the front, there’s only one button down there.
We call it the home button. Takes you home from wherever you are.
And that’s it. Let’s take a look at the side. [0:38:31]
It’s really thin. It’s thinner than any smart phone out there, at 11.6 millimeters.
Thinner than the Q, thinner than the BlackJack, thinner than all of them.
It’s really nice.
And we’ve got some controls on the side, we’ve got a little switch for ring and silent, we’ve got a volume up and down control.
Let’s look at the back.
On the back, the biggest thing of note is we’ve got a two-megapixel camera built right in.
The other side, we’re back in the front.
So let’s take a look at the top now.
We’ve got a headset jack. 3 and half millimeter all your iPod headphones fit right in.
We’ve got a place, a little tray for your SIM card, and we’ve got one switch for sleep and wake. Just push it to go to sleep, push it to wake up. [0:39:18]
Let’s take a look at the bottom.
We’ve got a speaker, we’ve got a microphone, and we’ve got our 30-pin iPod connector.
So that’s the bottom.

Now, we’ve also got some stuff you can’t see.
We’ve got three really advanced sensors built into this phone. [0:39:38]
The first one is a proximity sensor. It senses when physical objects get close, so when you bring iPhone up to your ear, to take a phone call, it turns off the display, and it turns off the touch sensor, instantly.
Well, why do you wanna do that?
Well, one to save battery, but two, so you don’t get spurious inputs from your face into the touch screen.
Just automatically turns them off, take it away, boom, it’s back on.
So it’s got a proximity sensor built in.
It’s got an ambient light sensor, as well. We sense the ambient lighting conditions and adjust the brightness of the display to match the ambient lighting conditions.
Again, better user experience, saves power. [0:40:10]
And the third thing we’ve got is an accelerometer, so that we can tell when you switch from portrait to landscape. It’s pretty cool. Show it to you in a minute. So three advanced sensors built in.[0:40:22]

So, let’s go ahead and turn it on.
This is the size of it. It fits beautifully in the palm of your hand.
So, an iPod, a phone, and an internet communicator.
Let’s start with the iPod. You can touch your music.
You can just touch your music, it’s so cool.
You’ve got a widescreen video. [0:40:51]
You can find your music even faster.
Gorgeous album art on this display.
Built-in speaker, and, why not? Cover flow. First time ever on an iPod.
So rather than talk about this some more, let me show it to you. [0:41:08]

Alrighty.
Now, I’ve got some special – some special – iPhones up here, they’ve got a little special board in them so I can get some digital video out, and I’ve got a little cord here which goes up to these projectors, and uh so I’ve got some great images, and you get to see what it really looks like.
So, let me, I’ve got a camera here so you can see what I’m doing with my finger for a few seconds [sniff].
And uh let me go ahead and get that picture within picture up.
I’m gonna go ahead and just push the sleep/wake button and there we go, right there. [0:41:47]
And to unlock the phone I just take my finger and slide it across.
Want to see that again? Sleep.
We wanted something you couldn’t do by accident in your pocket.
Just slide it across. Boom.
And this is the home screen of iPhone right here.
And so if I want to get in the iPod, I just go down to that lower right hand corner and push this icon right here, and boom, I’m in the iPod.
I wanna get home, I push the home button right here, and I’m home. [0:42:16]
Back in the iPod. I am back in the iPod.
Now, here I am you see five buttons across he bottom.
Playlists, artists, songs, videos and more. I’m in artists right now.
Well, how do I scroll through my lists of artists? [0:42:29]
How do I do this? I just take my finger, and I scroll. [0:42:35]
That’s it. Isn’t that cool?
A little rubber banding up when I run off the edge.
