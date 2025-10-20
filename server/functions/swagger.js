import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Election Visualization API',
      version: '1.0.0',
      description: 'Comprehensive REST API for Indian Lok Sabha Election Data (1991-2019). Provides access to 63,100 candidate records across 47 attributes, with advanced analytics and filtering capabilities.',
      contact: {
        name: 'Election Visualization Team',
        url: 'https://github.com/sachin8935/Election_Visualization',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api-jhwp2j7o5a-uc.a.run.app',
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check and monitoring endpoints',
      },
      {
        name: 'Data',
        description: 'Election data retrieval and filtering',
      },
      {
        name: 'Filters',
        description: 'Filter options for dropdowns and UI components',
      },
      {
        name: 'Analytics',
        description: 'Advanced analytics and visualization endpoints',
      },
      {
        name: 'Search',
        description: 'Search functionality for candidates and constituencies',
      },
      {
        name: 'AI',
        description: 'AI-powered natural language query endpoints',
      },
      {
        name: 'Debug',
        description: 'Development and debugging endpoints',
      },
    ],
    components: {
      schemas: {
        ElectionRecord: {
          type: 'object',
          properties: {
            State_Name: { type: 'string', example: 'Uttar Pradesh' },
            Assembly_No: { type: 'integer', example: 1 },
            Constituency_No: { type: 'integer', example: 50 },
            Year: { type: 'integer', example: 2019 },
            month: { type: 'number', nullable: true, example: 4 },
            Poll_No: { type: 'integer', example: 7 },
            DelimID: { type: 'integer', example: 2008 },
            Position: { type: 'integer', example: 1 },
            Candidate: { type: 'string', example: 'Narendra Modi' },
            Sex: { type: 'string', example: 'Male' },
            Party: { type: 'string', example: 'BJP' },
            Votes: { type: 'integer', example: 897382 },
            Candidate_Type: { type: 'string', example: 'GEN' },
            Valid_Votes: { type: 'integer', example: 1234567 },
            Electors: { type: 'integer', example: 1500000 },
            Constituency_Name: { type: 'string', example: 'Varanasi' },
            Constituency_Type: { type: 'string', example: 'GEN' },
            Sub_Region: { type: 'string', example: 'Eastern UP' },
            N_Cand: { type: 'integer', example: 26 },
            Turnout_Percentage: { type: 'integer', example: 60 },
            Vote_Share_Percentage: { type: 'number', example: 63.62 },
            Deposit_Lost: { type: 'string', example: 'No' },
            Margin: { type: 'integer', example: 479505 },
            Margin_Percentage: { type: 'number', example: 38.84 },
            ENOP: { type: 'number', example: 2.14 },
            Party_Type_TCPD: { type: 'string', example: 'National' },
            Is_Winner: { type: 'integer', example: 1 },
          },
        },
        PartySeatShare: {
          type: 'object',
          properties: {
            Year: { type: 'integer', example: 2019 },
            Party: { type: 'string', example: 'BJP' },
            seats_won: { type: 'integer', example: 303 },
            total_contested: { type: 'integer', example: 437 },
            avg_vote_share: { type: 'number', example: 37.36 },
          },
        },
        StateTurnout: {
          type: 'object',
          properties: {
            State_Name: { type: 'string', example: 'West Bengal' },
            Year: { type: 'integer', example: 2019 },
            avg_turnout: { type: 'number', example: 81.78 },
            total_votes: { type: 'integer', example: 58500000 },
            total_electors: { type: 'integer', example: 71500000 },
          },
        },
        GenderRepresentation: {
          type: 'object',
          properties: {
            Year: { type: 'integer', example: 2019 },
            Sex: { type: 'string', example: 'Female' },
            total_candidates: { type: 'integer', example: 724 },
            winners: { type: 'integer', example: 78 },
            win_rate: { type: 'number', example: 10.77 },
          },
        },
        TopParty: {
          type: 'object',
          properties: {
            Party: { type: 'string', example: 'BJP' },
            total_votes: { type: 'integer', example: 229894019 },
            vote_share_percentage: { type: 'number', example: 37.36 },
          },
        },
        MarginDistribution: {
          type: 'object',
          properties: {
            Year: { type: 'integer', example: 2019 },
            margin_category: { type: 'string', example: '0-5%' },
            count: { type: 'integer', example: 78 },
          },
        },
        SearchResult: {
          type: 'object',
          properties: {
            State_Name: { type: 'string', example: 'Karnataka' },
            Year: { type: 'integer', example: 2019 },
            Constituency_Name: { type: 'string', example: 'Bangalore South' },
            Candidate: { type: 'string', example: 'Tejasvi Surya' },
            Party: { type: 'string', example: 'BJP' },
            Votes: { type: 'integer', example: 920352 },
            Position: { type: 'integer', example: 1 },
            Vote_Share_Percentage: { type: 'number', example: 62.51 },
          },
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'ok' },
            db: { type: 'string', example: 'connected' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Server error' },
            message: { type: 'string', example: 'Detailed error message' },
          },
        },
      },
      parameters: {
        year: {
          in: 'query',
          name: 'year',
          schema: { type: 'integer' },
          description: 'Single election year (1991, 1996, 1998, 1999, 2004, 2009, 2014, 2019)',
          example: 2019,
        },
        years: {
          in: 'query',
          name: 'years',
          schema: { type: 'string' },
          description: 'Comma-separated list of election years',
          example: '2014,2019',
        },
        yearStart: {
          in: 'query',
          name: 'yearStart',
          schema: { type: 'integer' },
          description: 'Start year for range filter',
          example: 2009,
        },
        yearEnd: {
          in: 'query',
          name: 'yearEnd',
          schema: { type: 'integer' },
          description: 'End year for range filter',
          example: 2019,
        },
        states: {
          in: 'query',
          name: 'states',
          schema: { type: 'string' },
          description: 'Comma-separated list of state names',
          example: 'Uttar Pradesh,Maharashtra',
        },
        parties: {
          in: 'query',
          name: 'parties',
          schema: { type: 'string' },
          description: 'Comma-separated list of party abbreviations',
          example: 'BJP,INC,SP',
        },
        genders: {
          in: 'query',
          name: 'genders',
          schema: { type: 'string' },
          description: 'Comma-separated list of genders (Male, Female, Other)',
          example: 'Female',
        },
        constituencies: {
          in: 'query',
          name: 'constituencies',
          schema: { type: 'string' },
          description: 'Comma-separated list of constituency names',
          example: 'Amethi,Varanasi',
        },
        limit: {
          in: 'query',
          name: 'limit',
          schema: { type: 'integer', default: 5000, maximum: 5000 },
          description: 'Maximum number of records to return',
          example: 100,
        },
        offset: {
          in: 'query',
          name: 'offset',
          schema: { type: 'integer', default: 0 },
          description: 'Number of records to skip (pagination)',
          example: 0,
        },
      },
    },
  },
  apis: ['./routes.js', './controller.js', './analytics.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
