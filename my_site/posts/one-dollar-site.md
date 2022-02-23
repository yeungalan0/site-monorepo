---
title: "My Awesome One Dollar Site"
date: "2021-03-28"
tags: ["projects"]
---

# Purpose

Details the creation of my [One Dollar Site](/), tech used, and lessons learned.

I wanted to work on my webapp skills, and figured one of the easiest things I
could make was a one dollar site, and I was kinda right!

# Links

- [Project link](/one-dollar-site)
- [Front-end code](https://github.com/yeungalan0/my_site/blob/main/pages/one-dollar-site.tsx)
- [Back-end code](https://github.com/yeungalan0/one_dollar_site_back_end)

# Concept

A one dollar site is a site where you have the opportunity to pay one dollar to
see how many other people have paid one dollar, [here][example-site] is a pretty
well known example. As you can see:

1. It's a pretty simple concept to think about and code
1. It requires integration with a payments API, which will probably be needed
   for any monetized side projects I'd like to start in the future
1. It's publishable/displayable which means other people can see my work and
   give me feedback (also double edged sword, I can look at it a year later and
   see how awful it was)

With these properties it was a perfect project to start practicing my webapp
skills with!

# Tech used

- ReactJS: It was my first time really diving into this Javascript framework,
  and I have to say it was relatively easy to get the hang of and start working
  with! Some of the concepts of state management and when components render
  definitely took me more time to understand (I'm still working on some of it),
  but to initially get started and create simple components was really easy!
- [NextJS Framework][nextjs]: Also first time using this front end react
  framework! The documentation was great, and the beginner's guide/project was
  super easy to follow. It took me little effort to set up the front end of my
  project with this framework (though my design skills still definitely need
  work). Also their parent companies [free deployment tier][vercel-pricing] and
  pipelines for developers is AMAZING! I'll probably use NextJS for any of my
  projects that need a front end in the future!
- Node JS: First time using this for a backend service, and I have to say I can
  definitely see why it's so popular to be able to write your front end and
  backend code in the same language.There are vast libraries written for
  NodeJS/Javascript, so finding some interactions with the Paypal API were easy.
  Also Jest is a great test framework and I was able to get the code coverage
  quite high.
- AWS Lambda: Backend was written in NodeJS and deployed to Lambda, which is
  honestly a great way to prototype an application. Thought the cold start times
  are a bit of a pain.
- AWS DynamoDB
- AWS API-Gateway
- [Serverless Framework][serverless]: The framework is a bit confusing at first,
  but ultimately it is a super easy way to deploy an application to Lambda (or
  other cloud providers).
- Paypal API

# Lessons learned

The Paypal API doesn't allow you to collect actual money unless you are a
registered business :(. You can create and use a sandbox account for API testing
with a personal account, but unless you have a business account you cannot
activate your client for production (a.k.a real money) use.

[example-site]:
  http://www.howmanypeoplepaid1dollartoseehowmanypeoplepaid1dollar.com/
[vercel-pricing]: https://vercel.com/pricing
[nextjs]: https://nextjs.org/docs
[serverless]: https://www.serverless.com/framework/docs/
