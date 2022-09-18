package com.miniapp.knowclear;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.generator.AutoGenerator;
import com.baomidou.mybatisplus.generator.config.DataSourceConfig;
import com.baomidou.mybatisplus.generator.config.GlobalConfig;
import com.baomidou.mybatisplus.generator.config.PackageConfig;
import com.baomidou.mybatisplus.generator.config.StrategyConfig;
import com.baomidou.mybatisplus.generator.config.rules.DateType;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;
import com.miniapp.knowclear.entity.*;
import com.miniapp.knowclear.mapper.*;
import com.miniapp.knowclear.service.AccountService;
import com.miniapp.knowclear.utils.JwtUtils;
import com.miniapp.knowclear.vo.TopicVO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.Resource;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@SpringBootTest
class KnowclearApplicationTests {

	@Resource
	private UpvoteMapper upvoteMapper;

	@Resource
	private TopicMapper topicMapper;

	@Resource
	private TopicImgMapper topicImgMapper;

	@Resource
	private AccountMapper accountMapper;

	@Resource
	private LabelMapper labelMapper;


	@Test
	void contextLoads() {
		List<Label> labels = labelMapper.selectLabelsByTopicNum(1, 0);

		System.out.println(labels.subList(0,2));
		System.out.println(labels);


//		// 1、创建代码生成器
//		AutoGenerator mpg = new AutoGenerator();
//
//		// 2、全局配置
//		GlobalConfig gc = new GlobalConfig();
//		String projectPath = System.getProperty("user.dir");
//		//输出目录，有可能会更改
//		gc.setOutputDir("E:\\knowclear" + "/src/main/java");
//		//作者名称
//		gc.setAuthor("tlr&ztp");
//		gc.setOpen(false); //生成后是否打开资源管理器
//		gc.setFileOverride(true); //重新生成时文件是否覆盖
//		gc.setServiceName("%sService");	//去掉Service接口的首字母I
//		//ID_WORKER是mp自带主键策略，采用snowflake算法
//		gc.setIdType(IdType.AUTO); //主键策略
//		gc.setDateType(DateType.ONLY_DATE);//定义生成的实体类中日期类型
//		gc.setSwagger2(false);//开启Swagger2模式
//
//		mpg.setGlobalConfig(gc);
//
//		// 3、数据源配置,需要更改
//		DataSourceConfig dsc = new DataSourceConfig();
//		dsc.setUrl("jdbc:mysql://localhost/knowclear?serverTimezone=GMT%2B8&useSSL=false");
//		dsc.setDriverName("com.mysql.cj.jdbc.Driver");
//		dsc.setUsername("root");
//		dsc.setPassword("0123");
//		dsc.setDbType(DbType.MYSQL);
//		mpg.setDataSource(dsc);
//
//		// 4、包配置
//		PackageConfig pc = new PackageConfig();
//		//会生成一个包 名字叫com.onlineedu.eduservice
//		pc.setParent("com.miniapp");
//		pc.setModuleName("knowclear"); //模块名
//		//会生成一个包 名字叫com.onlineedu.controller等等
//		pc.setController("controller");
//		pc.setEntity("entity");
//		pc.setService("service");
//		pc.setMapper("mapper");
//		mpg.setPackageInfo(pc);
//
//		// 5、策略配置,看数据库的类型，根据数据库的表把代码的dao层逆向直接生成
//		StrategyConfig strategy = new StrategyConfig();
//		//可以直接生成多表
//		strategy.setInclude("account","collection","college","comment","consult","consult_comment","consult_img"
//		,"consult_upvote","label","topic","topic_img","upvote","banner","chat");
//
//		strategy.setNaming(NamingStrategy.underline_to_camel);//数据库表映射到实体的命名策略
//		strategy.setTablePrefix(pc.getModuleName() + "_"); //生成实体时去掉表前缀
//
//		strategy.setColumnNaming(NamingStrategy.underline_to_camel);//数据库表字段映射到实体的命名策略
//		strategy.setEntityLombokModel(true); // lombok 模型 @Accessors(chain = true) setter链式操作
//
//		strategy.setRestControllerStyle(true); //restful api风格控制器
//		strategy.setControllerMappingHyphenStyle(true); //url中驼峰转连字符
//
//		mpg.setStrategy(strategy);
//
//
//		// 6、执行
//		mpg.execute();
	}

}
