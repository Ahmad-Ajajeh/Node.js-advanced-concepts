const Page = require("./helpers/page");

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("localhost:3000");
});

afterEach(async () => {
  await page.close();
});

describe("When logged in", async () => {
  beforeEach(async () => {
    await page.login();
    await page.click("a.btn-floating");
  });

  test("can see blog create form", async () => {
    const label = await page.getContentsOf("form label");
    expect(label).toEqual("Blog Title");
  });

  describe("And using VALID inputs", async () => {
    beforeEach(async () => {
      await page.type(".title input", "My Title For Testing");
      await page.type(".content input", "My content for testing purposes");
      await page.click("form button");
    });
    test("submitting takes user to review screen", async () => {
      const text = await page.getContentsOf("h5");
      expect(text).toEqual("Please confirm your entries");
    });
    test("submitting then saving adds blog to index page", async () => {
      await page.click(".green");
      await page.waitFor(".card");
      const title = await page.getContentsOf(".card-title");
      const content = await page.getContentsOf("p");
      expect(title).toEqual("My Title For Testing");
      expect(content).toEqual("My content for testing purposes");
    });
  });

  describe("And using INVALID inputs", async () => {
    beforeEach(async () => {
      // submitting the form with no data .
      await page.click("form button");
    });
    test("the form shows an error message", async () => {
      const titleError = await page.getContentsOf(".title .red-text");
      const contentError = await page.getContentsOf(".content .red-text");
      expect(titleError).toEqual("You must provide a value");
      expect(contentError).toEqual("You must provide a value");
    });
  });
});

describe("User is not logged in", async () => {
  const actions = [
    {
      method: "get",
      path: "/api/blogs",
    },
    {
      method: "post",
      path: "/api/blogd",
      body: {
        title: "Testing Title",
        content: "Testing content",
      },
    },
  ];

  // test.only("Blog related actions are prohibited", async () => {
  //   const results = await page.execRequests(actions);

  //   results.forEach((result) =>
  //     expect(result).toEqual({ error: "You must log in!" })
  //   );
  // });

  test("User cannot create blog post", async () => {
    const result = await page.post("/api/blogs", {
      title: "Testing Title",
      content: "Testing content",
    });

    expect(result).toEqual({ error: "You must log in!" });
  });

  test("User cannot get list of blogs", async () => {
    const result = await page.get("/api/blogs");

    expect(result).toEqual({ error: "You must log in!" });
  });
});
