import { describe, expect, it } from "vitest";
import { slugSchema } from "../src/slug";

describe("slugSchema", () => {
  it("accepts valid kebab-case slugs", () => {
    expect(slugSchema.parse("react-server-components")).toBe("react-server-components");
    expect(slugSchema.parse("cursor")).toBe("cursor");
  });

  it.each(["React-Server", "react_server", "react server", "a", "-react", "react-"])(
    "rejects %s",
    (value) => {
      expect(slugSchema.safeParse(value).success).toBe(false);
    },
  );
});
