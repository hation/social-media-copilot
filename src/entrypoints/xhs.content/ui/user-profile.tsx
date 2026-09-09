import { CopyButton, CopyOption } from "@/components/copy/copy-button";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { defineSocialMediaCopilotUi } from "@/utils/ui";
import { webV1UserOtherinfo } from "../api/user";

const Component = (props: {
  userId: string;
}) => {
  const { userId } = props;
  const [userInfo, setUserInfo] = useState<XhsAPI.WebV1UserOtherinfo>();

  const getUserInfo = async () => {
    if (userInfo) return userInfo;
    const res = await webV1UserOtherinfo(userId);
    setUserInfo(res);
    return res;
  };

  const getCopyData = async () => {
    const user = await getUserInfo();
    const findCount = (type: string) => user.interactions?.find(item => item.type === type)?.count;
    return {
      ...user,
      follow_count: findCount('follows'),
      fans_count: findCount('fans'),
      interaction_count: findCount('interaction'),
    };
  };

  const handlerOpenExportDialog = async () => {
    const user = await getUserInfo();
    sendMessage('openTaskDialog', {
      name: 'author-post',
      author: {
        id: userId,
        name: user.basic_info.nickname,
        url: location.href
      }
    })
  }

  const copyOptions: CopyOption[] = [
    {
      label: "小红书号",
      value: "basic_info.red_id",
    },
    {
      label: "博主昵称",
      value: "basic_info.nickname",
    },
    {
      label: "个人简介",
      value: "basic_info.desc",
    },
    {
      label: "关注人数",
      value: "follow_count",
    },
    {
      label: "粉丝数",
      value: "fans_count",
    },
    {
      label: "获赞与收藏数",
      value: "interaction_count",
    }];

  return (<>
    <Logo />
    <CopyButton size="sm" options={copyOptions} getData={getCopyData}>复制博主信息</CopyButton>
    <Button size="sm" onClick={handlerOpenExportDialog}>导出笔记数据</Button>
  </>);
};

export default defineSocialMediaCopilotUi({
  name: 'social-media-copilot-xhs-user-profile',
  position: "inline",
  className: "flex pt-[20px] gap-4",
  matches: ["*://www.xiaohongshu.com/user/profile/*"],
  anchor: "#userPageContainer .user-info .info-part .info",
  render: ({ root, remove }) => {
    const userId = location.pathname.split('/').reverse()[0];
    if (userId) {
      root.render(<Component userId={userId} />);
    } else {
      remove();
    }
  },
});