import Vue from 'vue'

Vue.filter('price', (price, fixed=0)=>{
	if(!price || isNaN(price)){
		return 0
	}
	return fixed > 0 ? parseFloat(price).toFixed(fixed) : + parseFloat(price).toFixed(2);
})

Vue.filter('formPhone', (val)=>{
	if(!val || isNaN(val)){
		return 0
	}
	var mphone = val.substring(0, 3) + '****' + val.substring(7);
	 return mphone;
})
Vue.filter('distance', (val)=>{
	if(!val || isNaN(val)){
		return 0
	}
	var mphone = val.substring(0, 3) + '****' + val.substring(7);
	 return mphone;
})