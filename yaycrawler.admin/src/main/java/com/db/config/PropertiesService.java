package com.db.config;

/**
 * properties服务类
 */
public class PropertiesService {

	/**
	 * application配置文件
	 * 
	 * @return
	 */
	public static PropertiesConfig getApplicationConfig() {
		return PropertiesConfig.getInstance("/db.properties");
	}
}
