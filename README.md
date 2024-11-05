# Simple-HTML-form
Simple HTML form


## Test cases

| **Test Case ID** | **Test Description**                                        | **Input**                                      | **Expected Result**                                    |
|------------------|-------------------------------------------------------------|------------------------------------------------|--------------------------------------------------------|
| TC01             | Basic Valid Input (Positive integers)                      | First Number: `5`, Second Number: `10`         | Sum: `15`                                              |
| TC02             | Negative and Positive Integers                              | First Number: `-5`, Second Number: `10`        | Sum: `5`                                               |
| TC03             | Both Negative Numbers                                       | First Number: `-7`, Second Number: `-3`        | Sum: `-10`                                             |
| TC04             | Decimal Numbers                                             | First Number: `5.5`, Second Number: `3.2`      | Sum: `8.7`                                             |
| TC05             | Zero as Input                                               | First Number: `0`, Second Number: `0`          | Sum: `0`                                               |
| TC06             | Non-Numeric Input                                           | First Number: `5`, Second Number: `abc`        | Alert: "Please enter valid numbers." No sum displayed.  |
| TC07             | Empty Input (No Input Provided)                             | First Number: (empty), Second Number: `10`     | Alert: "Please enter valid numbers." No sum displayed.  |
| TC08             | Both Inputs Are the Same                                    | First Number: `7`, Second Number: `7`          | Sum: `14`                                              |
| TC09             | Large Numbers                                               | First Number: `999999`, Second Number: `1000000`| Sum: `1999999`                                         |
| TC10             | Decimal and Integer Combination                             | First Number: `2.5`, Second Number: `4`        | Sum: `6.5`                                             |
| TC11             | Invalid Input (Empty Form Submission)                       | First Number: (empty), Second Number: (empty)  | Alert: "Please enter valid numbers." No sum displayed.  |
