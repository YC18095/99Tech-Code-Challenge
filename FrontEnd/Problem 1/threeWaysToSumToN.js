// Provide 3 unique implementations of the following function in JavaScript.
// Input: n - any integer
// Assuming this input will always produce a result lesser than Number.MAX_SAFE_INTEGER.
// Output: return - summation to n, i.e. sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15.
var sum_to_n_a = function (n) {
  //using for loop
  let total = 0;
  for (let i = 0; i <= n; i++) {
    total += i;
  }
  return total;
};

var sum_to_n_b = function (n) {
  //using arithmetic sequence formula
  return (n * (n + 1)) / 2;
};

var sum_to_n_c = function (n) {
  //using recursion
  if (n <= 1) {
    return n;
  } else {
    return n + sum_to_n_c(n - 1);
  }
};

console.log(sum_to_n_a(5));
console.log(sum_to_n_b(5));
console.log(sum_to_n_c(5));
