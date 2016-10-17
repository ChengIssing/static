/**
 * Created by cy on 2016/9/28.
 * 试卷模块
 */
angular.module("app.paper",["ng","app.subject"])
    //查询控制器
    .controller("paperListController",["$scope",function ($scope) {

    }])
    //添加控制器
    .controller("paperAddController",["$scope","commonService","$routeParams","paperModel","paperService",function ($scope,commonService,$routeParams,paperModel,paperService) {
        commonService.getAllDepartmentes(function (data) {
            //将全部方向绑定到作用域的departments中
            $scope.dep = data;
        });
        var subjectId = $routeParams.id;
        if(subjectId!=0){
            paperModel.addSubjectId(subjectId);
            paperModel.addSubject(angular.copy($routeParams))
        }
        //双向绑定的模板
        $scope.pmodel = paperModel.model;
        $scope.savePaper = function () {
            paperService.savePaper($scope.pmodel,function (data) {
                alert(data)
            })
        }
    }])
    //试卷删除控制器
    .controller("paperDelController",["$scope",function ($scope) {

    }])
    .factory("paperService",["$httpParamSerializer","$http",function ($httpParamSerializer,$http) {
        return {
            savePaper: function (params, handler) {
                //处理数据
                var obj = {};
                for (var key in params) {
                    var val = params[key];
                    switch (key) {
                        case "departmentId":
                            obj['paper.department.id	'] = val;
                            break;
                        case "title":
                            obj['paper.title'] = val;
                            break;
                        case "desc":
                            obj['paper.description.id'] = val;
                            break;
                        case "at":
                            obj['paper.answerQuestionTime'] = val;
                            break;
                        case "total":
                            obj['paper.totalPoints'] = val;
                            break;
                        case "scores":
                            obj['scores'] = val;
                            break;
                        case "subjectIds":
                            obj['subjectIds'] = val;
                            break;
                    }
                }
                //对obj对象进行表单格式的序列化（默认使用json格式）
                obj = $httpParamSerializer(obj);
                $http.post("http://172.16.0.5:7777/test/exam/manager/saveSubject.action", obj, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).success(function (data) {
                        handler(data);
                });
            }
        }
    }])
    .factory("paperModel",function () {
        return{
            // 模板 单例如
            model:{
                departmentId:1,     //方向id
                title:"",           //试卷标题
                desc:"",            //试卷描述
                at:0,               //答题时间
                total:100,            //总分
                scores:[],           //每个题目的分值
                subjectIds:[],       //每个题目的id
                subjects:[]
            },
            addSubjectId:function (id) {
                this.model.subjectIds.push(id)
            },
            addSubject:function (subject) {
                this.model.subjects.push(subject)
            }
        }
    })

