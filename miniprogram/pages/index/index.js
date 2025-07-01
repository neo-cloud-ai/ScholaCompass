// pages/index/index.js
Page({
  data: {
    currentQuestionIndex: 0,
    questions: [
      "你的高考预估分数是多少？（如果已经出分，请填写实际分数）",
      "你所在的省份是哪里？",
      "你的文理科方向是什么？",
      "你对哪些学科比较感兴趣？",
      "你希望就读的大学所在城市或地区有什么偏好吗？",
      "你对未来的职业有什么规划或想法吗？",
      "你有什么特长或者获得过什么奖项吗？",
      "你的家庭经济状况如何？（用于考虑学费和生活费因素）",
      "你更看重大学的哪些方面？（如排名、专业实力、就业率、校园环境等）"
    ],
    answers: [],
    showResult: false,
    promptText: '',
    progressPercent: 0,
    isLoading: false,
    provinces: [
      "北京市", "天津市", "河北省", "山西省", "内蒙古自治区",
      "辽宁省", "吉林省", "黑龙江省", "上海市", "江苏省",
      "浙江省", "安徽省", "福建省", "江西省", "山东省",
      "河南省", "湖北省", "湖南省", "广东省", "广西壮族自治区",
      "海南省", "重庆市", "四川省", "贵州省", "云南省",
      "西藏自治区", "陕西省", "甘肃省", "青海省", "宁夏回族自治区",
      "新疆维吾尔自治区"
    ],
    selectedProvinceIndex: 0,
    subjects: ["理科", "文科"],
    selectedSubjectIndex: 0,
    interestSubjects: ["数学", "物理", "化学", "生物", "计算机", "文学", "历史", "哲学", "经济", "法律", "医学", "艺术"],
    selectedInterest: null
  },

  onLoad() {
    // 页面加载时初始化
    const answers = new Array(this.data.questions.length).fill('');
    const itemAnimations = this.data.interestSubjects.map(() => null);
    
    this.setData({ 
      answers,
      selectedProvinceIndex: 0,
      selectedSubjectIndex: 0,
      selectedInterest: null,
      itemAnimations
    });
    this.updateProgressPercent();
  },

  // 更新进度百分比
  updateProgressPercent() {
    const percent = Math.round((this.data.currentQuestionIndex + 1) / this.data.questions.length * 100);
    this.setData({ progressPercent: percent });
  },

  handleInput(e) {
    const { answers } = this.data;
    answers[this.data.currentQuestionIndex] = e.detail.value;
    this.setData({ answers });
  },

  handleProvinceChange(e) {
    const { answers, provinces } = this.data;
    const selectedIndex = e.detail.value;
    answers[1] = provinces[selectedIndex]; // 第二个问题是省份
    this.setData({ 
      answers,
      selectedProvinceIndex: selectedIndex
    });
  },

  handleSubjectChange(e) {
    const { answers, subjects } = this.data;
    const selectedIndex = e.detail.value;
    answers[2] = subjects[selectedIndex]; // 第三个问题是文理科
    this.setData({ 
      answers,
      selectedSubjectIndex: selectedIndex
    });
  },

  toggleInterest(e) {
    const { interestSubjects } = this.data;
    const selectedIndex = Number(e.detail.value);
    
    console.log('选中项:', interestSubjects[selectedIndex]);
    
    // 同步更新状态
    this.setData({
      selectedInterest: selectedIndex,
      [`answers[3]`]: interestSubjects[selectedIndex]
    }, () => {
      console.log('更新后验证:', {
        selected: this.data.selectedInterest,
        answer: this.data.answers[3]
      });
    });
  },

  nextQuestion() {
    const currentAnswer = this.data.answers[this.data.currentQuestionIndex];
    
    // 检查当前问题是否已回答
    if (this.data.currentQuestionIndex === 1) {
      // 省份选择问题
      if (!currentAnswer) {
        wx.showToast({
          title: '请选择省份',
          icon: 'none'
        });
        return;
      }
    } else if (this.data.currentQuestionIndex === 2) {
      // 文理科选择问题
      if (!currentAnswer) {
        wx.showToast({
          title: '请选择文理科',
          icon: 'none'
        });
        return;
      }
    } else if (this.data.currentQuestionIndex === 3) {
      // 学科兴趣问题 - 检查是否已选择
      if (this.data.selectedInterest === null) {
        wx.showToast({
          title: '请选择一个感兴趣的学科',
          icon: 'none'
        });
        return;
      }
    } else if (!currentAnswer || currentAnswer.trim() === '') {
      // 其他问题
      wx.showToast({
        title: '请回答当前问题',
        icon: 'none'
      });
      return;
    }

    if (this.data.currentQuestionIndex < this.data.questions.length - 1) {
      this.setData({
        currentQuestionIndex: this.data.currentQuestionIndex + 1
      });
      this.updateProgressPercent();
    } else {
      this.generatePrompt();
    }
  },

  prevQuestion() {
    if (this.data.currentQuestionIndex > 0) {
      this.setData({
        currentQuestionIndex: this.data.currentQuestionIndex - 1
      });
      this.updateProgressPercent();
    }
  },

  generatePrompt() {
    // 设置加载状态
    this.setData({ isLoading: true });
    
    const { answers, questions } = this.data;
    let prompt = "我是一名高考学生，正在进行志愿填报，以下是我的基本情况：\n\n";
    
    questions.forEach((question, index) => {
      prompt += `${question}\n${answers[index]}\n\n`;
    });

    prompt += "\n请以张雪峰老师的风格，根据我的情况给出详细的志愿填报建议，包括：\n";
    prompt += "1. 根据分数和地区，推荐3-5所适合的大学和专业组合（包括冲、稳、保的梯度选择）\n";
    prompt += "2. 这些院校和专业的优势分析（包括就业前景、专业实力、师资力量等）\n";
    prompt += "3. 填报策略（如何合理安排志愿顺序，平行志愿的技巧）\n";
    prompt += "4. 各个专业的未来发展前景、就业方向和薪资水平\n";
    prompt += "5. 需要注意的特殊招生政策、加分政策或招生计划变化\n";
    prompt += "6. 对我个人特点、兴趣爱好与专业的匹配度分析\n";
    prompt += "7. 大学期间的学习规划和能力培养建议\n\n";
    prompt += "请用通俗易懂的语言回答，像张雪峰老师一样直接、幽默且有洞见，并给出具体的理由和数据支持。如果可能的话，也请提供一些备选方案和规避风险的建议。";

    // 模拟生成过程，添加短暂延迟以显示加载状态
    setTimeout(() => {
      // 保存分析结果到历史记录
      const timestamp = new Date().getTime();
      const historyItem = {
        timestamp,
        summary: `高考分数: ${answers[0]}, 省份: ${answers[1]}, 文理科: ${answers[2]}`,
        prompt,
        answers: [...answers]
      };
      
      const history = wx.getStorageSync('analysisHistory') || [];
      history.push(historyItem);
      wx.setStorageSync('analysisHistory', history);

      this.setData({
        showResult: true,
        promptText: prompt,
        isLoading: false
      });
    }, 800);
  },

  navigateToHistory() {
    wx.navigateTo({
      url: '/pages/history/history'
    });
  },

  copyPrompt() {
    wx.setClipboardData({
      data: this.data.promptText,
      success: () => {
        wx.showToast({
          title: '提示词已复制',
          icon: 'success'
        });
      }
    });
  },

  restartQuestions() {
    this.setData({
      currentQuestionIndex: 0,
      answers: new Array(this.data.questions.length).fill(''),
      showResult: false,
      promptText: ''
    });
  }
})