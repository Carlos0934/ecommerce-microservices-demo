export class ItemTransformer implements Transformer<string, string> {
  constructor(private readonly lastItemId: string) {}
  transform(
    chunk: string,
    controller: TransformStreamDefaultController<string>
  ) {
    const specialChars = new Set(["[", "]"]);

    if (specialChars.has(chunk)) {
      controller.enqueue(chunk);
      return;
    }

    const { price, title, asin, productURL, imgUrl, stars, reviews } =
      JSON.parse(chunk);

    const isLastItem = asin === this.lastItemId;
    const item = {
      id: asin,
      price: parseFloat(price),
      title: title,
      productURL,
      imgUrl,
      stars: parseFloat(stars),
      reviews: parseInt(reviews),
    };

    controller.enqueue(`${JSON.stringify(item)}${isLastItem ? "" : ","}`);
  }

  start(controller: TransformStreamDefaultController<string>) {
    controller.enqueue("[");
  }

  flush(controller: TransformStreamDefaultController<string>) {
    controller.enqueue("]");
  }
}
