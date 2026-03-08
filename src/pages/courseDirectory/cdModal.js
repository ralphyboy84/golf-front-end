import { images } from "../../pages/courseGallery/courseVariables";
import { viewCourseGallery } from "../../pages/courseGallery/courseGallery";
import { getOpensForCourse } from "../../pages/api";
import { formatDateToDMY } from "../../pages/dateFunctions";
import { getLoadingDiv } from "../../pages/loadingDiv";

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", function (event) {
    if (event.target.closest(".cdModal")) {
      const button = event.target.closest(".cdModal");
      document.getElementById("my_modal_1").showModal();

      loadModalContent(button);
    }
  });
});

async function loadModalContent(button) {
  const toShow = button.getAttribute("data-toShow");

  let header = "TBC";
  let content = "TBC";

  if (toShow == "top100") {
    header = "Top 100";
    content = "This course appears in many of the Scottish Top 100 list";
  } else if (toShow == "region") {
    header = "Region";

    const region = button.getAttribute("data-region");

    if (region == "fife") {
      content =
        'Fife is globally revered as the "Home of Golf" a title anchored by the historic town of St Andrews. For over 600 years, the game has evolved on these coastal links, with the Old Course serving as the sport\'s ultimate pilgrimage site. Beyond this iconic centerpiece, the "Kingdom" boasts a dense concentration of over 44 world-class courses, ranging from the rugged, cliffside beauty of Kingsbarns and Dumbarnie Links to the quirky charm of Crail and Elie.<br /><br />The region offers a diverse golfing landscape where traditional links meet lush inland parklands like Ladybank. Whether you are navigating the famous Swilcan Bridge or playing a hidden gem in the East Neuk, golf in Fife is more than just a sport; it is a deep immersion into the heritage, rules, and very soul of the game.';
    } else if (region == "angus") {
      content = `Angus, Scotland, is a premier golfing destination, offering a diverse collection of over 30 courses ranging from rugged coastal links to scenic inland parklands. At its heart lies the legendary Carnoustie Golf Links, widely regarded as "Golf’s Greatest Test." Its Championship Course has hosted The Open eight times and is notorious for the Barry Burn, which creates a dramatic finish on the closing holes.<br /><br />Beyond Carnoustie, the region boasts incredible heritage. Montrose Golf Links features the 1562 Course, the fifth oldest in the world, while Panmure Golf Club—where Ben Hogan famously practiced before his 1953 Open victory—offers a world-class heathland experience. Other notable gems include the historic Monifieth Medal, the sea-side Arbroath Golf Links, and the inland beauty of Forfar, the world's first course designed with 18 holes from its inception. Whether you are seeking championship challenges or hidden gems, Angus provides an authentic Scottish golfing experience steeped in history.`;
    }
  } else if (toShow == "category") {
    header = "Course Category";

    const category = button.getAttribute("data-category");

    if (category == "a") {
      content = `Category A - these are the heavyweights of the "Open Rota"—the elite selection of courses that have hosted the world's oldest major. This category is dominated by legends like the Old Course at St Andrews, Muirfield, Royal Troon, Carnoustie, and Turnberry (Ailsa). Playing here is a pilgrimage. These links are defined by their immense historical gravity, brutal bunkers, and the unpredictable coastal winds that have broken the world's best players. They are impeccably maintained, expensive to play, and offer a "bucket list" experience that transcends the sport itself.`;
    } else if (category == "b") {
      content = `Category B contains courses ranking roughly 20–50 are the "hidden" giants that often rival Category A in quality, if not in Open history. This tier includes the legendary Nairn, the stunning modern masterpiece Dundonald, and the quirky, brilliant Brora. You will also find St Andrews Jubilee and Panmure here. These courses are frequently rated among the world's best. They offer world-class layouts and breathtaking scenery but lack the "Major" hosting status, often making them slightly more accessible—though no less challenging or visually spectacular.`;
    } else if (category == "c") {
      content = `Ranking from 50–100, Category C represents the backbone of high-quality Scottish golf. It features storied names like Golspie, Irvine, and Gullane No. 2, alongside inland gems like Downfield or the Landsdown at Blairgowrie. These courses provide a premier experience with professional-grade conditioning but without the premium price tag of the top 20. They often possess more "character" and unique local quirks, offering a truer sense of the Scottish club atmosphere. For many regular visitors, Category C provides the best balance of value and championship-level play.`;
    } else if (category == "d") {
      content = `Category D encompasses hundreds of "hidden gems" and local municipal courses that represent the true soul of Scottish golf. From the nine-hole clifftop beauty of Anstruther to historic town links like Cullen or Reay, these are the courses where the locals play. They are affordable, welcoming, and often situated on naturally stunning land that hasn't been over-engineered. While they may lack the global fame of a St Andrews, they offer a fast-paced, authentic, and "raw" version of the game that is increasingly rare elsewhere in the world.`;
    }
  } else if (toShow == "courseType") {
    header = "Course Type";

    const courseType = button.getAttribute("data-courseType");

    if (courseType == "Links") {
      content = `Links golf is the game in its purest, most primordial form. Derived from the Scots word hlinc, it refers to the "link" of sandy, undulating land connecting the sea to arable farmland. These courses are defined by treeless landscapes, fescue grasses, and deep pot bunkers carved by coastal winds. Unlike the aerial "target golf" common in America, links play requires a ground-game strategy. Players must use the natural contours of the earth, often bumping and running the ball to account for firm turf and the unpredictable, whistling "haar" or gale-force winds.<br /><br />The challenge is organic; every hollow and ridge can deflect a perfectly struck shot, requiring immense creativity and patience. It is a raw battle against the elements, where the luck of the bounce is just as significant as the swing itself.`;
    } else if (courseType == "Inland") {
      content = `In Scotland, non-links golf—often referred to as inland golf—is primarily divided into three distinct styles: Parkland, Heathland, and Moorland.<br /><br />Parkland courses are lush, manicured, and framed by mature trees, resembling a grand estate or public park. They prize accuracy over power, requiring players to navigate narrow, tree-lined corridors and man-made water hazards. Heathland courses (like Blairgowrie) offer a "best of both worlds" experience; they are inland but feature the sandy soil, firm turf, and rugged gorse or purple heather typically associated with links. Finally, Moorland courses (such as the King's Course at Gleneagles) are situated on higher, peaty ground, offering dramatic elevation changes and sweeping vistas across the Scottish wilderness.<br /><br />Unlike the unpredictable bounces of the coast, inland courses reward high, soft shots and traditional "target" play, providing a more sheltered, serene encounter with the Scottish countryside.`;
    }
  } else if (toShow == "gallery") {
    const courseid = button.getAttribute("data-courseid");

    header = "Gallery";
    content = viewCourseGallery(courseid, images);
  } else if (toShow == "ralphRecommends") {
    const courseid = button.getAttribute("data-courseid");

    header = "Ralph Recommends";
    content =
      "A special Ralph recommendation. These courses have a special place in my heart and are well worth a visit";
  } else if (toShow == "opens") {
    const courseid = button.getAttribute("data-courseid");

    document.getElementById("modalContent").innerHTML =
      "Please wait.... loading....";

    const opens = await getOpensForCourse(courseid);

    content = "No Opens found for this course";

    if (opens.length > 0) {
      content = `<div class="max-w-md mx-auto mt-6 space-y-2">`;

      for (let x in opens) {
        const openName = getUrl(opens[x]);
        const date = formatDateToDMY(opens[x].date);
        content += `
        <div class="flex justify-between pb-1">
          <div class="font-medium text-gray-700">${date}</div>
          <div>${openName}</div>
        </div>`;
      }

      content += `</div<`;
    }

    header = "Opens";
  }

  document.getElementById("modalHeader").innerHTML = header;
  document.getElementById("modalContent").innerHTML = content;
}

function getUrl(opens) {
  if (opens.openBookingSystem == "brs") {
    return `<a href="https://visitors.brsgolf.com/${opens.brsDomain}#/open-competitions/${opens.openid}/teesheet" target="_blank">${opens.name}</a>`;
  } else if (opens.openBookingSystem == "clubv1") {
    return `<a href="https://howdidido-whs.clubv1.com/hdidbooking/open?token=${opens.token}&cid=${opens.openid}" target="_blank">${opens.name}</a>`;
  }

  return opens.name;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
