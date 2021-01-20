JavaScript SQL User-Defined Function (UDF) User-Agent Parser Library for the [uap-core](https://github.com/ua-parser/uap-core) project.

The primary platform for this is [Google BigQuery](https://cloud.google.com/bigquery).

## Related Links

 * [ua-parser](https://github.com/ua-parser)
     * [uap-core](https://github.com/ua-parser/uap-core)
     * [ua-parser Specification](https://github.com/ua-parser/uap-core/blob/master/docs/specification.md)
 * [Google BigQuery](https://cloud.google.com/bigquery)
     * [Standard SQL user-defined functions](https://cloud.google.com/bigquery/docs/reference/standard-sql/user-defined-functions)

# Preflight

You will need:

 * `curl`
 * `git`
 * `make`
 * `python3`

Check out the project with:

    git clone https://gitlab.com/jimdigriz/uap-js-udf.git

# Deploy

Go into the project directory and run:

    make

Copy the following to a Google Storage account (eg. `gs://mybucket/uaparser/`):

 * `uaparser.js`
 * `regexes.js`

# Usage

Use the following to use the parser:

    CREATE TEMP FUNCTION uaparser(ua STRING)
    RETURNS STRUCT<
      user_agent STRUCT<
        family STRING,
        major STRING,
        minor STRING,
        patch STRING
      >,
      os STRUCT<
        family STRING,
        major STRING,
        minor STRING,
        patch STRING,
        patchMinor STRING
      >,
      device STRUCT<
        family STRING,
        brand STRING,
        model STRING
      >
    >
    DETERMINISTIC
    LANGUAGE js
    OPTIONS (
      -- description = "User-Agent Parser (https://gitlab.com/jimdigriz/uap-js-udf)",
      library = [
        "gs://mybucket/uaparser/regexes.js",
        "gs://mybucket/uaparser/uaparser.js"
      ]
    )
    AS "return uaparser(ua);";
    
    SELECT user_agent, uaparser(user_agent) AS uap FROM `[PROJECT].[DATASET].[TABLE]` WHERE ...;

**N.B.** remove the comment (leading '`--`') from the `description` if you make this a non-temporary function

## Partial Parsing

If you only want to parse our the user agent, OS or device details, you can pick the more specific function to make the query faster:

### User Agent

    CREATE TEMP FUNCTION uaparser_user_agent(ua STRING)
    RETURNS STRUCT<
      family STRING,
      major STRING,
      minor STRING,
      patch STRING
    >
    DETERMINISTIC
    LANGUAGE js
    OPTIONS (
      -- description = "User-Agent Parser (https://gitlab.com/jimdigriz/uap-js-udf)",
      library = [
        "gs://mybucket/uaparser/regexes.js",
        "gs://mybucket/uaparser/uaparser.js"
      ]
    )
    AS "return uaparser.user_agent(ua);";
    
    SELECT user_agent, uaparser_user_agent(user_agent) AS uap_user_agent FROM `[PROJECT].[DATASET].[TABLE]` WHERE ...;

### Operating System

    CREATE TEMP FUNCTION uaparser_os(ua STRING)
    RETURNS STRUCT<
      family STRING,
      major STRING,
      minor STRING,
      patch STRING,
      patchMinor STRING
    >
    DETERMINISTIC
    LANGUAGE js
    OPTIONS (
      -- description = "User-Agent Parser (https://gitlab.com/jimdigriz/uap-js-udf)",
      library = [
        "gs://mybucket/uaparser/regexes.js",
        "gs://mybucket/uaparser/uaparser.js"
      ]
    )
    AS "return uaparser.os(ua);";
    
    SELECT user_agent, uaparser_os(user_agent) AS uap_os FROM `[PROJECT].[DATASET].[TABLE]` WHERE ...;

### Device

    CREATE TEMP FUNCTION uaparser_device(ua STRING)
    RETURNS STRUCT<
      family STRING,
      brand STRING,
      model STRING
    >
    DETERMINISTIC
    LANGUAGE js
    OPTIONS (
      -- description = "User-Agent Parser (https://gitlab.com/jimdigriz/uap-js-udf)",
      library = [
        "gs://mybucket/uaparser/regexes.js",
        "gs://mybucket/uaparser/uaparser.js"
      ]
    )
    AS "return uaparser.device(ua);";
    
    SELECT user_agent, uaparser_device(user_agent) AS uap_device FROM `[PROJECT].[DATASET].[TABLE]` WHERE ...;
