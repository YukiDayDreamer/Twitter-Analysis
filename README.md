# Twitter-Analysis

[Demo Websites](http://purduetweets.azurewebsites.net)

I try to do some cool stuffs :smiling_imp: with Twitter data, and this is a dashboard like Twitter Analysis platform built with JavaScript and PHP, and it is sourced by Twitter data in West Lafayette, home of Purdue University, between 2014 and 2015.

There are two projects in the repository:

1. Individual User Pattern Analysis
2. Event Detection

## Individual User Pattern Analysis

[Demo of Individual Pattern](http://purduetweets.azurewebsites.net/individual.html)

This project tries to find out the pattern of the most active users in the campus, spatial, temporal and textual patterns.

Dashboard

![Dashboard of Individual](https://github.com/YukiDayDreamer/Twitter-Analysis/blob/master/README/individual/dashboard.png)

### Workflow

1. Group tweets of individual user by hour, then apply [DBSCAN](https://en.wikipedia.org/wiki/DBSCAN) to detect cluters.

2. Analyze the probability of the apperance of user in different clusters with similar method like [Huang's Work]( http://www.tandfonline.com/doi/full/10.1080/00045608.2015.1081120#.VjuF-YT5_rw), as well as calculate center of cluster, radius, keywords and other metadata of the clusters.

Sample Cluster

![Sample Cluster](https://github.com/YukiDayDreamer/Twitter-Analysis/blob/master/README/individual/cluster.png)

3. Construct the tweeting frency bar chart with gathering clusters in the same type, then we could know the structure. If "Frequency" dominates the bar chart, the user is likely to be a nerd who would like to stay at specific places like office or apartments (Like me :joy:), while if "Rarely" dominates the bar chart, the user would like to appear at different places as a social butterfly~ (What I want to be !) 

Frequency Bar Chart

![Time Bar](https://github.com/YukiDayDreamer/Twitter-Analysis/blob/master/README/individual/time%20chart.png)

## Event Detection

[Demo of Event Detection](http://purduetweets.azurewebsites.net/EventDetection.html)

This one tries to detect events in the campus. The idea for event detection is based on this definition of event:

**Some people** around a **place** in specific **period** talking about something realted to **a topic**

Dashboard

![Dashboard of Individual](https://github.com/YukiDayDreamer/Twitter-Analysis/blob/master/README/event_detection/dashboard.png)

### Workflow

1. Groud tweets by day, generate line chart about number of tweets and users monthly

![Monthly Pattern](https://github.com/YukiDayDreamer/Twitter-Analysis/blob/master/README/event_detection/monthly%20pattern.png)

2. Different from DBSCAN for individual pattern, I apply [ST-DBSCAN](http://www.sciencedirect.com/science/article/pii/S0169023X06000218) to do cluster the tweets every day. Then we could know its sptial and temporal pattern.

Pick a cluster

![Main Map](https://github.com/YukiDayDreamer/Twitter-Analysis/blob/master/README/event_detection/main%20map.png)

Its spatial pattern with heatmap

![Heat Map](https://github.com/YukiDayDreamer/Twitter-Analysis/blob/master/README/event_detection/heatmap.png)

Its temporal pattern

![Temporal Pattern](https://github.com/YukiDayDreamer/Twitter-Analysis/blob/master/README/event_detection/temporal%20pattern.png)

Dynamic Map of sptial pattern in different periods (It is not playable in GitHub, highly recommend you to have a look at the DEMO !!)

![Dynamic Map](https://github.com/YukiDayDreamer/Twitter-Analysis/blob/master/README/event_detection/dynamic%20map.png)

3. Count word frequency. Apply [LDA](https://en.wikipedia.org/wiki/Latent_Dirichlet_allocation) to do find out potential topics in the cluster and analyze the structure of every tweets. Although some clusters only contain rambling words (even after using a list of stop-words as a filter), some important events, like Gunshot at Campus (1.21.2104), Super Bowl (2.2.2014) and Graduation Ceremony (5.16.2014 ~ 5.18.2014), are really significant in the textual information. And also able to detect unkonwn events.

Word frequncy in descending order

![Word Freq](https://github.com/YukiDayDreamer/Twitter-Analysis/blob/master/README/event_detection/word%20frequency.png)

Sample original texts

![Sample Texts](https://github.com/YukiDayDreamer/Twitter-Analysis/blob/master/README/event_detection/sampel%20text.png)

LDA topics and structure of Tweets

![LDA Topics](https://github.com/YukiDayDreamer/Twitter-Analysis/blob/master/README/event_detection/LDA%20Topics.png)

![LDA Sentences](https://github.com/YukiDayDreamer/Twitter-Analysis/blob/master/README/event_detection/LDA%20Sentences.png)


Acknowledgement: Thanks [CanvasJS](http://canvasjs.com/) to provide chart API.

Enjoy! :cheer:

PS: Fork and Star are reallllllllllly welcome ~~~
