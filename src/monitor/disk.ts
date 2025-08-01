import si from "systeminformation";
import contrib from "blessed-contrib";

type CharType = contrib.Widgets.PictureElement;
type FsSizeData = si.Systeminformation.FsSizeData;

class DiskMonitor {
  donut: CharType;

  interval: NodeJS.Timeout | null = null;

  constructor(donut: CharType) {
    this.donut = donut;
  }

  init() {
    const updater = () => {
      si.fsSize("", (data) => {
        this.updateData(data);
      });
    };
    updater();

    this.interval = setInterval(updater, 10000);
  }

  updateData(data: Array<FsSizeData>) {
    const disk = data[0];

    const label = formatSize(disk.used) + " of " + formatSize(disk.size);

    this.donut.setData([
      {
        percent: disk.use / 100,
        label: label,
        color: "green",
      },
    ]);
    this.donut.screen.render();
  }
}
function formatSize(bytes: number) {
  return (bytes / 1024 / 1024 / 1024).toFixed(2) + " GB";
}

export {
  DiskMonitor
}