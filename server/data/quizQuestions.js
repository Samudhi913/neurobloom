const quizQuestions = {
  math: [
    { id: 'm1', question: 'What is 12 × 8?',                                     options: ['86','96','106','76'],                                                        answer: '96'  },
    { id: 'm2', question: 'What is x if 2x + 4 = 12?',                           options: ['3','4','5','6'],                                                             answer: '4'   },
    { id: 'm3', question: 'What is 25% of 200?',                                  options: ['25','40','50','75'],                                                         answer: '50'  },
    { id: 'm4', question: 'Area of rectangle with width 5 and height 8?',         options: ['13','26','40','45'],                                                         answer: '40'  },
    { id: 'm5', question: 'What is the square root of 144?',                      options: ['10','11','12','13'],                                                         answer: '12'  },
  ],
  science: [
    { id: 's1', question: 'Chemical symbol for water?',                           options: ['WA','H2O','HO2','W2O'],                                                      answer: 'H2O' },
    { id: 's2', question: 'How many planets in our solar system?',                options: ['7','8','9','10'],                                                            answer: '8'   },
    { id: 's3', question: 'Gas plants absorb during photosynthesis?',             options: ['Oxygen','Nitrogen','Carbon Dioxide','Hydrogen'],                             answer: 'Carbon Dioxide' },
    { id: 's4', question: 'Powerhouse of the cell?',                              options: ['Nucleus','Mitochondria','Ribosome','Vacuole'],                               answer: 'Mitochondria'   },
    { id: 's5', question: 'What force keeps us on the ground?',                   options: ['Magnetism','Friction','Gravity','Tension'],                                  answer: 'Gravity'        },
  ],
  english: [
    { id: 'e1', question: 'Synonym for "happy"?',                                 options: ['Sad','Joyful','Angry','Tired'],                                              answer: 'Joyful'         },
    { id: 'e2', question: 'Which is a noun?',                                     options: ['Run','Quickly','Beautiful','Table'],                                         answer: 'Table'          },
    { id: 'e3', question: 'Punctuation that ends a question?',                    options: ['Full stop','Comma','Question mark','Exclamation mark'],                      answer: 'Question mark'  },
    { id: 'e4', question: 'Past tense of "run"?',                                 options: ['Runned','Running','Ran','Runs'],                                             answer: 'Ran'            },
    { id: 'e5', question: 'Which sentence is correct?',                           options: ['She go to school','She goes to school','She going to school','She gone to school'], answer: 'She goes to school' },
  ],
  history: [
    { id: 'h1', question: 'First President of the United States?',                options: ['Abraham Lincoln','George Washington','Thomas Jefferson','John Adams'],        answer: 'George Washington'      },
    { id: 'h2', question: 'Year World War II ended?',                             options: ['1943','1944','1945','1946'],                                                 answer: '1945'                   },
    { id: 'h3', question: 'Ancient wonder located in Egypt?',                     options: ['Colosseum','Great Wall','Great Pyramid of Giza','Parthenon'],                answer: 'Great Pyramid of Giza'  },
    { id: 'h4', question: 'Year the Titanic sank?',                               options: ['1910','1912','1914','1916'],                                                 answer: '1912'                   },
    { id: 'h5', question: 'Empire ruled by Julius Caesar?',                       options: ['Greek','Ottoman','Roman','Egyptian'],                                        answer: 'Roman'                  },
  ],
  art: [
    { id: 'a1', question: 'Who painted the Mona Lisa?',                           options: ['Picasso','Van Gogh','Leonardo da Vinci','Michelangelo'],                     answer: 'Leonardo da Vinci' },
    { id: 'a2', question: 'What are the primary colours?',                        options: ['Red, Blue, Green','Red, Yellow, Blue','Orange, Purple, Green','Black, White, Grey'], answer: 'Red, Yellow, Blue' },
    { id: 'a3', question: 'Art style using small dots to create images?',         options: ['Cubism','Surrealism','Pointillism','Impressionism'],                         answer: 'Pointillism'       },
    { id: 'a4', question: 'Which artist cut off his own ear?',                    options: ['Monet','Van Gogh','Dali','Picasso'],                                         answer: 'Van Gogh'          },
    { id: 'a5', question: 'What is the blending of colours called?',              options: ['Sketching','Shading','Gradient','Hatching'],                                 answer: 'Gradient'          },
  ],
};

module.exports = quizQuestions;