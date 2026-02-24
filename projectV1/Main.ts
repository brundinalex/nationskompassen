import * as collectData from "./collectData";
import * as handleData from "./handleData";



async function main() {
  try {
    const categories = await collectData.getEvents();
    console.log(categories[2].events);
    //get_pubs(categories);
    // console.log(get_distance(nations[0], nations[1]));
  } catch (err) {
    console.error(err);
  }
}
main();