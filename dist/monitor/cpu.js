import si from "systeminformation";
const colors = ["magenta", "cyan", "blue", "yellow", "green", "red"];
class CpuMonitor {
    constructor(line) {
        //存储cpu源数据
        this.cpuData = [];
        //保存定时器
        this.interval = null;
        this.lineChart = line;
    }
    //初始化cpu监控数据
    init() {
        si.currentLoad((data) => {
            this.cpuData = data.cpus.map((cpu, index) => {
                return {
                    title: `CPU ${index + 1}`,
                    style: {
                        line: colors[index % colors.length],
                    },
                    x: Array(60).fill(0),
                    y: Array(60).fill(0),
                };
            });
            this.updateData(data);
            this.interval = setInterval(() => {
                si.currentLoad((data) => {
                    this.updateData(data);
                });
            }, 1000);
        });
    }
    //更新cpu内容
    updateData(data) {
        data.cpus.forEach((cpu, index) => {
            //获取cpu占用率，并且每个占位符为6个字符，保证排版时内容美观
            let loadString = cpu.load.toFixed(1).toString();
            while (loadString.length < 6) {
                loadString = " " + loadString;
            }
            loadString = loadString + "%";
            this.cpuData[index].title = `CPU${index + 1} ${loadString}`;
            //这块是为了模拟折线图滚动效果，从数组的开头删除一个元素，然后在末尾添加一个新的元素
            this.cpuData[index].y.shift();
            this.cpuData[index].y.push(cpu.load);
        });
        this.lineChart.setData(this.cpuData);
        this.lineChart.screen.render();
    }
    //销毁定时器
    destroyed() {
        if (this.interval) {
            clearInterval(this.interval);
            this.cpuData = [];
        }
    }
}
export { CpuMonitor };
