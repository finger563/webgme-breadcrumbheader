define([
    'js/Constants',
    'css!./BreadCrumbHeader.css'
], function(
    CONSTANTS
) {

    var DEFAULT_CONFIG = {
            style: 'simple'
        },
        STYLES = {
            arrows: 'panels/BreadcrumbHeader/styles/arrows.css'
        };

    var ProjectNavWithActiveNode = function (options) {
        this.$el = options.container;
        this.client = options.client;
        this.logger = options.logger.fork('NodePath');

        // Load the config
        this.config = WebGMEGlobal.componentSettings[this.getComponentId()] ||
            DEFAULT_CONFIG;

        this.initialize();
    };

    ProjectNavWithActiveNode.prototype.initialize = function() {
        var breadcrumbContainer = document.createElement('ol');

        breadcrumbContainer.setAttribute('style', 'height:100%');
        this.pathContainer = $(breadcrumbContainer);
        this.$el.append(breadcrumbContainer);

        // Set the activeNode
        WebGMEGlobal.State.on('change:' + CONSTANTS.STATE_ACTIVE_OBJECT,
            this.updatePath, this);

        // Load the css
        if (this.config.style !== DEFAULT_CONFIG.style) {
            // load the style or assume requirejs path
            var cssPath = STYLES[this.config.style] || this.config.style;

            require(['css!' + cssPath], function() {
                breadcrumbContainer.setAttribute('class', 'breadcrumb-nodes');
            }, function(err) {
                this.logger.warn('Could not load css at ' + cssPath + ': ' + err);
                breadcrumbContainer.setAttribute('class', 'breadcrumb');
            });
        } else {
            breadcrumbContainer.setAttribute('class', 'breadcrumb');
        }
    };

    ProjectNavWithActiveNode.prototype.getComponentId = function() {
        return 'BreadCrumbHeader';
    };

    ProjectNavWithActiveNode.prototype.clear = function(model, nodeId) {
        this.pathContainer.empty();
        // TODO: clear territories
    };

    ProjectNavWithActiveNode.prototype.updatePath = function(model, nodeId) {
        var node = this.client.getNode(nodeId),
            baseId,
            nodes = [];

        if (!node) {
            return;
        }

        // Clear the bar
        this.clear();

        // Populate the bar with the nodes from the root to the active node
        while (!!node) {
            baseId = node.getParentId();
            nodes.push({id: nodeId, node: node});

            // Get the next
            nodeId = baseId;
            node = this.client.getNode(nodeId);
        }

        for (var i = nodes.length-1; i >= 0; i--) {
            this.addNode(nodes[i]);
        }
    };

    ProjectNavWithActiveNode.prototype.addNode = function(nodeObj, isActive) {
        // Set the territory for the node (in case of rename)
        var item = document.createElement('li'),
            anchor = document.createElement('a'),
            id = nodeObj.id,
            node = nodeObj.node;

        if (isActive) {
            item.setAttribute('class', 'active');
            item.innerHTML = node.getAttribute('name');
        } else {
            anchor.innerHTML = node.getAttribute('name');
            item.appendChild(anchor);
            item.addEventListener('click', 
                WebGMEGlobal.State.registerActiveObject.bind(WebGMEGlobal.State, id));
        }

        this.pathContainer.append(item);
    };

    ProjectNavWithActiveNode.prototype.updateNode = function() {
        // Update the node name, if needed
        // TODO

        // What if things are moved/deleted?
        // TODO
    };

    ProjectNavWithActiveNode.prototype.selectNode = function(node) {
        // Change the activeNode to the selected node
        // TODO
    };

    return ProjectNavWithActiveNode;
});
