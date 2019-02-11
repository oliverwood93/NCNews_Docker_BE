const { expect } = require('chai');
const { formatTime, formatComments, getArticleIdLookup } = require('../db/utils');

describe('#Seeding Functions', () => {
  describe('#formatTime', () => {
    it('converts a article or comments created at from epoch time into ISO time', () => {
      const article = [
        {
          title: 'Running a Node App',
          topic: 'coding',
          author: 'jessjelly',
          body:
            'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
          created_at: 1471522072389,
        },
      ];
      const expected = [
        {
          title: 'Running a Node App',
          topic: 'coding',
          author: 'jessjelly',
          body:
            'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
          created_at: '2016-08-18T12:07:52.389Z',
        },
      ];
      expect(formatTime(article)).to.eql(expected);
    });
  });
  describe('#getArticleIdLookup', () => {
    it('creares a lookup object with keys as title of articles passed in and their id as the value', () => {
      const articles = [
        {
          article_id: 1,
          title: 'Running a Node App',
          body:
            'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
          votes: 0,
          topic: 'coding',
          author: 'jessjelly',
          created_at: '2016-08-18T12:07:52.389Z',
        },
        {
          article_id: 2,
          title: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
          body:
            'Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to takethings even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.',
          votes: 0,
          topic: 'coding',
          author: 'jessjelly',
          created_at: '2017-07-20T20:57:53.256Z',
        },
      ];
      const expected = {
        'Running a Node App': 1,
        "The Rise Of Thinking Machines: How IBM's Watson Takes On The World": 2,
      };
      expect(getArticleIdLookup(articles)).to.eql(expected);
    });
  });
  describe('#formatComments', () => {
    const comment = [
      {
        body:
          'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
        belongs_to: 'The People Tracking Every Touch, Pass And Tackle in the World Cup',
        created_by: 'tickle122',
        votes: -1,
        created_at: '2016-07-09T18:07:18.932Z',
      },
    ];
    const articleRef = {
      'The People Tracking Every Touch, Pass And Tackle in the World Cup': 18,
    };
    it('takes an array of comment objects and returns a new array of comment object containg correct keys', () => {
      const expected = [
        {
          author: 'tickle122',
          article_id: 18,
          votes: -1,
          created_at: '2016-07-09T18:07:18.932Z',
          body:
            'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
        },
      ];

      expect(formatComments(comment, articleRef)).to.eql(expected);
    });
    it('does not mutate original array', () => {
      formatComments(comment, articleRef);
      const expected = [
        {
          body:
            'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
          belongs_to: 'The People Tracking Every Touch, Pass And Tackle in the World Cup',
          created_by: 'tickle122',
          votes: -1,
          created_at: '2016-07-09T18:07:18.932Z',
        },
      ];
      expect(comment).to.eql(expected);
    });
  });
});
