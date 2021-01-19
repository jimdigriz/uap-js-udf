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
 * `make`
 * `python3`

Fetch [`regexes.yaml`](https://github.com/ua-parser/uap-core/blob/master/regexes.yaml) and convert it to JSON with:

    make regexes.json

# Usage

...
